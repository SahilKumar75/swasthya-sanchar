import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Swasthya Sanchar/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Swasthya Sanchar');
    
    // Check subtitle
    await expect(page.locator('text=Blockchain-based Healthcare Records System')).toBeVisible();
  });

  test('should have patient and doctor portal buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check patient portal button
    const patientButton = page.locator('text=Patient Portal');
    await expect(patientButton).toBeVisible();
    
    // Check doctor portal button
    const doctorButton = page.locator('text=Doctor Portal');
    await expect(doctorButton).toBeVisible();
  });

  test('should navigate to patient portal', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Patient Portal');
    
    await expect(page).toHaveURL('/patient');
    await expect(page.locator('h1')).toContainText('Patient Portal');
  });

  test('should navigate to doctor portal', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Doctor Portal');
    
    await expect(page).toHaveURL('/doctor');
    await expect(page.locator('h1')).toContainText('Doctor Portal');
  });
});
