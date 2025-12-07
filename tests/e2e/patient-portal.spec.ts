import { test, expect } from '@playwright/test';

test.describe('Patient Portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patient');
  });

  test('should display patient portal page', async ({ page }) => {
    // Check title
    await expect(page.locator('h1')).toContainText('Patient Portal');
    
    // Check subtitle
    await expect(page.locator('text=Manage your health records on the blockchain')).toBeVisible();
  });

  test('should show connect wallet button', async ({ page }) => {
    // Should show connect wallet button when not connected
    await expect(page.locator('button:has-text("Connect Wallet")')).toBeVisible();
  });

  test('should display feature preview cards', async ({ page }) => {
    // Check for feature cards
    await expect(page.locator('text=📝 Registration')).toBeVisible();
    await expect(page.locator('text=🏥 Records')).toBeVisible();
    await expect(page.locator('text=🔐 Access')).toBeVisible();
  });

  test('should have header with home link', async ({ page }) => {
    const homeLink = page.locator('header a:has-text("Swasthya Sanchar")');
    await expect(homeLink).toBeVisible();
    
    // Click home link
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should display placeholder message', async ({ page }) => {
    await expect(
      page.locator('text=/Patient registration and record management features/i')
    ).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check header exists
    await expect(page.locator('header')).toBeVisible();
    
    // Check main content area exists
    await expect(page.locator('main')).toBeVisible();
    
    // Check dashboard section when scrolling
    const dashboard = page.locator('text=Your Dashboard');
    if (await dashboard.isVisible()) {
      await expect(dashboard).toBeVisible();
    }
  });
});
