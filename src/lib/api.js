export async function api(path, options = {}) {
  const { body, ...rest } = options;
  let response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...rest,
      ...(body instanceof FormData
        ? { body }
        : body !== undefined
          ? {
              body: JSON.stringify(body),
              headers: { 'Content-Type': 'application/json' },
            }
          : {}),
    });
  } catch {
    throw new Error('Не вдалося з’єднатися із сервером. Спробуйте ще раз.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(result.error || 'Не вдалося виконати запит.');
  return result;
}
