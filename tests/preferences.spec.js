import { test, expect } from '@playwright/test';

async function chooseLanguage(page, language) {
  await page.locator('.language-trigger').click();
  await page
    .getByRole('menuitemradio', {
      name: language === 'en' ? /English/ : /Українська/,
    })
    .click();
  await expect(page.locator('html')).toHaveAttribute('lang', language);
}

test('theme follows system preference until overridden and survives reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const background = await page
    .locator('html')
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  const icon = await page.locator('.theme-toggle').innerHTML();
  await page.getByRole('button', { name: 'Увімкнути світлу тему' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.locator('.theme-toggle').innerHTML()).not.toBe(icon);
  expect(
    await page
      .locator('html')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe(background);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(
    page.getByRole('button', { name: 'Увімкнути темну тему' }),
  ).toBeVisible();
});

test('language menu supports keyboard, escape, outside click and persistence', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.locator('.language-trigger');
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitemradio', { name: /Українська/ }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitemradio', { name: /English/ }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(
    page.getByRole('heading', { name: 'Made to be yours.' }),
  ).toBeVisible();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press('Tab');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.contacts-block a').first()).toBeFocused();
  await trigger.click();
  await page.getByRole('heading', { name: 'Made to be yours.' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(trigger).toContainText('EN');
  await page
    .getByRole('textbox', { name: 'Search the catalog' })
    .fill('hoodie');
  await expect(page.locator('.content-card')).toHaveCount(1);
  await expect(page.locator('.content-card')).toContainText('Hoodie');
  await expect(page.locator('.catalog-results')).toHaveText('1 product');
});

test('English pages and server errors are translated', async ({ page }) => {
  await page.goto('/');
  await chooseLanguage(page, 'en');
  for (const route of [
    '/',
    '/product/1',
    '/favorite',
    '/cart',
    '/login',
    '/signup',
    '/recovery',
    '/delivery',
    '/contacts',
    '/about-us',
    '/missing',
  ]) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('main').innerText(), route).not.toMatch(
      /[А-Яа-яІіЇїЄєҐґ]/,
    );
  }
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('missing@example.com');
  await page.getByLabel('Password', { exact: true }).fill('NotARealPassword');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Incorrect email or password.',
  );
  await chooseLanguage(page, 'uk');
  await expect(page.getByRole('alert')).toHaveText(
    'Неправильний email або пароль.',
  );
  await page.goto('/product/1');
  await chooseLanguage(page, 'en');
  await page.locator('summary').filter({ hasText: 'Size guide' }).click();
  await expect(
    page.getByRole('columnheader', { name: 'Size', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('table')).not.toContainText('Розміри');
});

test('theme and language changes preserve cart, favorites and checkout input', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/product/1');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Купити' }).click();
  await page.getByRole('button', { name: 'Додати до обраного' }).click();
  await chooseLanguage(page, 'en');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.locator('.connect-btn').filter({ hasText: 'Favorites' }).click();
  await expect(page.locator('.favorite-item')).toContainText('T-shirt');
  await page.locator('.connect-btn').filter({ hasText: 'Cart' }).click();
  await expect(page.locator('.cart-item')).toContainText('Size: M');
  await page.getByRole('link', { name: 'Checkout', exact: true }).click();
  await page.getByLabel('Full name').fill('Jane Smith');
  await page.getByLabel('Phone number').fill('+380501234567');
  await page.getByLabel('Delivery address').fill('Kyiv, Khreshchatyk 1, 01001');
  await chooseLanguage(page, 'uk');
  await expect(page.getByLabel('Ім’я та прізвище')).toHaveValue('Jane Smith');
  await page.getByRole('button', { name: 'Увімкнути світлу тему' }).click();
  await chooseLanguage(page, 'en');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(
    page.getByRole('heading', { name: 'Order saved' }),
  ).toBeVisible();
  await expect(page.locator('.receipt-items')).toContainText('T-shirt');
  await expect(page.locator('.confirmation')).toContainText('New');
  expect(await page.locator('main').innerText()).not.toMatch(
    /[А-Яа-яІіЇїЄєҐґ]/,
  );
});

for (const width of [320, 375, 768, 1440]) {
  test(`both languages and themes fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const language of ['en', 'uk']) {
      await chooseLanguage(page, language);
      for (const theme of ['light', 'dark']) {
        if ((await page.locator('html').getAttribute('data-theme')) !== theme)
          await page.locator('.theme-toggle').click();
        await page.locator('.language-trigger').click();
        await expect(page.getByRole('menu')).toBeVisible();
        const menu = await page.getByRole('menu').boundingBox();
        expect(menu.x).toBeGreaterThanOrEqual(0);
        expect(menu.x + menu.width).toBeLessThanOrEqual(width);
        await page.keyboard.press('Escape');
        for (const route of ['/', '/product/1', '/signup']) {
          await page.goto(route);
          await expect(page.locator('html')).toHaveAttribute(
            'data-theme',
            theme,
          );
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth),
            `${language}/${theme}/${route}`,
          ).toBeLessThanOrEqual(width);
        }
      }
    }
  });
}
