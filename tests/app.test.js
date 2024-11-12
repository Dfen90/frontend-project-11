import { test, expect } from '@playwright/test';

test('RSS reader functionality', async ({ page }) => {
  await page.goto('http://localhost:8080');
  
  // Проверяем пустой ввод
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('Не должно быть пустым');
  
  // Проверяем некорректный URL
  await page.fill('input[aria-label="url"]', 'invalid-url');
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('Ссылка должна быть валидным URL');
  
  // Проверяем существующий RSS
  const validRSS = 'https://ru.hexlet.io/lessons.rss';
  await page.fill('input[aria-label="url"]', validRSS);
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('RSS успешно загружен');
  
  // Проверяем повторное добавление
  await page.fill('input[aria-label="url"]', validRSS);
  await page.click('button[type="submit"]');
  await expect(page.locator('.feedback')).toHaveText('RSS уже существует');
  
  // Проверяем кнопку предпросмотра
  await expect(page.locator('button', { hasText: 'Просмотр' })).toBeVisible();
});
