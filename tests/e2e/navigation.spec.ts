import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test('should complete full navigation flow', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Swasthya Sanchar');
    
    // Navigate to patient portal
    await page.click('text=Patient Portal');
    await expect(page).toHaveURL('/patient');
    await expect(page.locator('h1')).toContainText('Patient Portal');
    
    // Return to home
    await page.click('header a:has-text("Swasthya Sanchar")');
    await expect(page).toHaveURL('/');
    
    // Navigate to doctor portal
    await page.click('text=Doctor Portal');
    await expect(page).toHaveURL('/doctor');
    await expect(page.locator('h1')).toContainText('Doctor Portal');
    
    // Return to home again
    await page.click('header a:has-text("Swasthya Sanchar")');
    await expect(page).toHaveURL('/');
  });

  test('should handle direct URL access', async ({ page }) => {
    // Direct access to patient portal
    await page.goto('/patient');
    await expect(page.locator('h1')).toContainText('Patient Portal');
    
    // Direct access to doctor portal
    await page.goto('/doctor');
    await expect(page.locator('h1')).toContainText('Doctor Portal');
    
    // Direct access to home
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Swasthya Sanchar');
  });

  test('should maintain state during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Go to patient portal
    await page.click('text=Patient Portal');
    const connectButton = page.locator('button:has-text("Connect Wallet")').first();
    await expect(connectButton).toBeVisible();
    
    // Navigate away and back
    await page.goto('/');
    await page.click('text=Patient Portal');
    
    // Button should still be there
    await expect(page.locator('button:has-text("Connect Wallet")').first()).toBeVisible();
  });
});
