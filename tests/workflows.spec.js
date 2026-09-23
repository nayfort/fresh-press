import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const password = 'FreshPress-2026!';
const email = () => `test-${crypto.randomUUID()}@example.com`;
async function signup(page, address) {
  await page.goto('/signup');
  await page.getByLabel('Email', { exact: true }).fill(address);
  await page.getByLabel('Пароль', { exact: true }).fill(password);
  await page.getByLabel('Підтвердьте пароль').fill(password);
  await page.getByRole('button', { name: 'Зареєструватися' }).click();
  await expect(page.locator('.recovery-code')).toBeVisible();
  return page.locator('.recovery-code').innerText();
}

test('account persists, validates credentials and updates profile and password', async ({
  page,
}) => {
  const address = email();
  await signup(page, address);
  await page.getByRole('link', { name: 'Код збережено — до акаунту' }).click();
  await page.getByLabel('Ім’я', { exact: true }).fill('Олена');
  await page.getByLabel('Прізвище').fill('Коваль');
  await page.getByLabel('Телефон', { exact: true }).fill('+380501234567');
  await page.getByRole('button', { name: 'Зберегти зміни' }).click();
  await expect(page.getByRole('status')).toHaveText('Зміни збережено.');
  await page.reload();
  await expect(page.getByLabel('Ім’я', { exact: true })).toHaveValue('Олена');
  await page.getByLabel('Поточний пароль').fill(password);
  await page.getByLabel('Новий пароль').fill('ChangedPassword123!');
  await page.getByLabel('Підтвердьте пароль').fill('ChangedPassword123!');
  await page.getByRole('button', { name: 'Зберегти зміни' }).click();
  await expect(page.getByRole('status')).toHaveText('Зміни збережено.');
  await page.getByRole('button', { name: 'Вийти' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Email').fill(address);
  await page.getByLabel('Пароль', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Увійти', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Неправильний email або пароль.',
  );
  await page.getByLabel('Пароль', { exact: true }).fill('ChangedPassword123!');
  await page.getByRole('button', { name: 'Увійти', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Мій акаунт' })).toBeVisible();
});

test('recovery rotates code and revokes previous sessions', async ({
  page,
  browser,
}) => {
  const address = email();
  const code = await signup(page, address);
  const other = await browser.newContext();
  const recovery = await other.newPage();
  await recovery.goto('/recovery');
  await recovery.getByLabel('Email').fill(address);
  await recovery.getByLabel('Код відновлення', { exact: true }).fill(code);
  await recovery.getByLabel('Новий пароль').fill('RecoveredPassword123!');
  await recovery.getByLabel('Підтвердьте пароль').fill('RecoveredPassword123!');
  await recovery.getByRole('button', { name: 'Відновити доступ' }).click();
  await expect(recovery.locator('.recovery-code')).toBeVisible();
  expect(await recovery.locator('.recovery-code').innerText()).not.toBe(code);
  await page.goto('/account');
  await expect(page).toHaveURL(/\/login$/);
  const response = await page.request.post('/api/recover', {
    data: { email: address, code, password },
  });
  expect(response.status()).toBe(400);
  await other.close();
});

test('uploaded designs persist in cart and order; prices come from server', async ({
  page,
}) => {
  await signup(page, email());
  await page.goto('/product/1');
  await page
    .getByLabel('Файл для друку')
    .setInputFiles('src/assets/imgs/png/icon.png');
  await expect(page.locator('.design-preview')).toBeVisible();
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.getByRole('button', { name: 'Вид ззаду' }).click();
  await page
    .getByLabel('Файл для друку')
    .setInputFiles('src/assets/imgs/png/logo.png');
  await expect(page.locator('.uploaded-file')).toContainText('logo.png');
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.locator('.connect-btn').filter({ hasText: 'Кошик' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await page.getByRole('link', { name: 'Замовити', exact: true }).click();
  await page.getByLabel('Ім’я та прізвище').fill('Олена Коваль');
  await page.getByLabel('Номер телефону').fill('+380501234567');
  await page.getByLabel('Адреса доставки').fill('Київ, Хрещатик 1, 01001');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Оформити замовлення' }).click();
  await expect(
    page.getByRole('heading', { name: 'Замовлення збережено' }),
  ).toBeVisible();
  await expect(page.locator('.summary-total')).toContainText('$100');
  await expect(page.locator('.receipt-items .artwork-link')).toHaveCount(3);
  const orderUrl = page.url();
  await page.reload();
  await expect(page.locator('.order-number')).toContainText('FP-');
  await page.goto('/account');
  await expect(page.locator('.history-item')).toHaveCount(1);
  await page.locator('.history-item').click();
  await expect(page).toHaveURL(orderUrl);
  await page.goto('/cart');
  await expect(
    page.getByRole('heading', { name: 'Кошик порожній' }),
  ).toBeVisible();
});

test('API rejects unauthorized access, forged totals, invalid quantities and duplicate orders', async ({
  request,
  playwright,
}) => {
  await request.get('/api/session');
  expect((await request.get('/api/orders')).status()).toBe(401);
  const payload = {
    items: [{ id: 1, selectedSize: 'M', quantity: 2, price: 0.01 }],
    fullName: 'Test User',
    address: 'Kyiv 123',
    phone: '+380501234567',
    terms: true,
    requestKey: crypto.randomUUID(),
  };
  const first = await request.post('/api/orders', { data: payload });
  expect(first.status()).toBe(201);
  const { order } = await first.json();
  expect(order.total).toBe(100);
  const second = await request.post('/api/orders', { data: payload });
  expect((await second.json()).order.id).toBe(order.id);
  expect(
    (
      await request.post('/api/orders', {
        data: {
          ...payload,
          requestKey: crypto.randomUUID(),
          items: [{ ...payload.items[0], quantity: -1 }],
        },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/orders', {
        data: { ...payload, requestKey: crypto.randomUUID(), terms: false },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/logout', {
        headers: { origin: 'https://untrusted.example' },
      })
    ).status(),
  ).toBe(403);
  const stranger = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4173',
  });
  expect((await stranger.get(`/api/orders/${order.id}`)).status()).toBe(404);
  await stranger.dispose();
});

test('invalid upload is rejected without losing product controls', async ({
  page,
}) => {
  await page.goto('/product/8');
  await page.getByLabel('Файл для друку').setInputFiles({
    name: 'bad.png',
    mimeType: 'image/png',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.getByRole('alert')).toContainText('Не вдалося прочитати');
  await expect(page.getByRole('button', { name: 'Купити' })).toBeEnabled();
  await expect(page.locator('.size-options')).toHaveCount(0);
});

test('favorites survive reload and empty search can be reset', async ({
  page,
}) => {
  await page.goto('/product/3');
  await page.getByRole('button', { name: 'Додати до обраного' }).click();
  await page.goto('/favorite');
  await expect(page.locator('.favorite-item')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.favorite-item')).toHaveCount(1);
  await page.goto('/');
  await page
    .getByRole('textbox', { name: 'Пошук по каталогу' })
    .fill('not-a-product');
  await expect(
    page.getByRole('heading', { name: 'Нічого не знайдено' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Скинути пошук' }).click();
  await expect(page.locator('.content-card')).toHaveCount(8);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`layouts stay within viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/product/1',
      '/product/2',
      '/favorite',
      '/login',
      '/signup',
      '/recovery',
      '/delivery',
      '/contacts',
      '/about-us',
      '/missing',
    ]) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      const size = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(size.content, path).toBeLessThanOrEqual(size.viewport);
    }
    await page.goto('/product/1');
    await page.getByRole('button', { name: 'Купити' }).click();
    await page.locator('.connect-btn').filter({ hasText: 'Кошик' }).click();
    await expect(page.locator('.cart-item')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.getByRole('link', { name: 'Замовити', exact: true }).click();
    await expect(page.getByLabel('Адреса доставки')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

test('mobile account and checkout handle long names and artwork without overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await signup(page, email());
  await page.getByRole('link', { name: 'Код збережено — до акаунту' }).click();
  await page.getByLabel('Ім’я', { exact: true }).fill('ДовгеІм’я'.repeat(8));
  await page.getByLabel('Прізвище').fill('ДовгеПрізвище'.repeat(5));
  await page.getByRole('button', { name: 'Зберегти зміни' }).click();
  await expect(page.getByRole('status')).toHaveText('Зміни збережено.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page.goto('/product/1');
  const fileName = `${'МійДужеДовгийДизайн'.repeat(6)}.png`;
  await page.getByLabel('Файл для друку').setInputFiles({
    name: fileName,
    mimeType: 'image/png',
    buffer: await readFile('src/assets/imgs/png/icon.png'),
  });
  await expect(page.locator('.uploaded-file')).toContainText(fileName);
  await expect(page.locator('.design-preview')).toBeVisible();
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.locator('.connect-btn').filter({ hasText: 'Кошик' }).click();
  await expect(page.locator('.cart-item')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page.getByRole('link', { name: 'Замовити', exact: true }).click();
  await page.getByLabel('Номер телефону').fill('+380501234567');
  await page.getByLabel('Адреса доставки').fill('ДовгаАдреса'.repeat(30));
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Оформити замовлення' }).click();
  await expect(
    page.getByRole('heading', { name: 'Замовлення збережено' }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});

test('invalid stored cart entries do not break shopping', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'freshpress.cart.v2',
      JSON.stringify([null, { id: 1, quantity: -5 }, { id: 999, quantity: 1 }]),
    ),
  );
  await page.goto('/product/1');
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.locator('.connect-btn').filter({ hasText: 'Кошик' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(1);
});
