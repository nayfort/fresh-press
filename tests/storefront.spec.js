import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
  page.on('dialog', (dialog) => dialog.accept());
});

test('catalog search, categories and popularity survive product navigation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.content-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Одяг', exact: true }).click();
  await expect(page.locator('.content-card')).toHaveCount(4);
  await page.locator('.search-input').fill('Худі');
  await expect(page.locator('.content-card')).toHaveCount(1);
  await page.locator('.content-card').click();
  await page.getByAltText('Fresh Press').click();
  await page.getByText('За рейтингом', { exact: true }).click();
  await expect(page.locator('.content-card').first()).toContainText('Худі');
});

test('sizes are separate cart lines and quantity/removal affect only one size', async ({
  page,
}) => {
  await page.goto('/product/1');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.getByRole('button', { name: 'L', exact: true }).click();
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.locator('.connect-btn').filter({ hasText: 'Кошик' }).click();
  const rows = page.locator('.cart-item');
  await expect(rows).toHaveCount(2);
  await expect(rows.first().locator('select')).toHaveValue('2');
  await rows.first().locator('select').selectOption('3');
  await expect(rows.first()).toContainText('$150');
  await expect(rows.last()).toContainText('$50');
  await rows.first().getByRole('button', { name: 'Видалити' }).click();
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('Розмір: L');
});

test('product views, favorites and removal work', async ({ page }) => {
  await page.goto('/product/2');
  const front = await page.locator('.product-image-view').getAttribute('src');
  await page.getByText('Вид ззаду', { exact: true }).click();
  await expect(page.locator('.product-image-view')).not.toHaveAttribute(
    'src',
    front,
  );
  await page.locator('.product-favorite').click();
  await page.locator('.connect-btn').filter({ hasText: 'Обране' }).click();
  await expect(page.locator('.favorite-item')).toHaveCount(1);
  await page.locator('.favorite-remove').click();
  await expect(page.getByText('Немає товарів')).toBeVisible();
});

test('invalid product IDs and unknown routes do not crash', async ({
  page,
}) => {
  for (const path of [
    '/product/999',
    '/product/1abc',
    '/product/nope',
    '/missing',
  ]) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: 'До каталогу' })).toBeVisible();
  }
});

test('every product image loads and all existing pages render', async ({
  page,
}) => {
  for (let id = 1; id <= 8; id++) {
    await page.goto(`/product/${id}`);
    for (const view of await page.locator('.view-item').all()) {
      await view.click();
      await expect(page.locator('.product-image-view')).toBeVisible();
      await expect
        .poll(() =>
          page
            .locator('.product-image-view')
            .evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
    }
  }
  for (const path of [
    '/login',
    '/signup',
    '/account',
    '/order',
    '/about-us',
    '/delivery',
    '/contacts',
  ]) {
    await page.goto(path);
    await expect(page.locator('.header-container')).toBeVisible();
  }
  await page.goto('/login');
  await expect(page.getByPlaceholder('password')).toHaveAttribute(
    'type',
    'password',
  );
});

test('catalog stays above the footer on short screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/');
  const cards = await page.locator('.items-block').boundingBox();
  const footer = await page.locator('.footer-container').boundingBox();
  expect(footer.y).toBeGreaterThanOrEqual(cards.y + cards.height);
});
