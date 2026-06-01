import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should navigate to sign in page and show validation errors', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Attempt to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Expect validation errors
    await expect(page.getByText(/invalid email/i)).toBeVisible();
    await expect(page.getByText(/password must be at least/i)).toBeVisible();
  });

  test('should navigate to sign up page from sign in', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
  });
});
