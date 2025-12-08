import { test, expect } from '@playwright/test';

test.describe('Emergency Responder Page', () => {
  const testPatientAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  
  test('should load emergency page without wallet connection', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Verify page loads without requiring wallet
    await expect(page.getByRole('heading', { name: 'Emergency Access' })).toBeVisible();
    await expect(page.getByText('First Responder View')).toBeVisible();
    
    // Should not require wallet connection
    const walletButton = page.getByRole('button', { name: /Connect Wallet/i });
    await expect(walletButton).not.toBeVisible();
  });

  test('should display emergency alert banner', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for emergency alert
    await expect(page.getByText(/Instant Emergency Access.*No Wallet Required/i)).toBeVisible();
    await expect(page.getByText(/Critical patient info from blockchain/i)).toBeVisible();
  });

  test('should show patient blockchain address', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Verify patient address is displayed
    await expect(page.getByText('Patient Blockchain Address:')).toBeVisible();
    await expect(page.getByText(testPatientAddress)).toBeVisible();
  });

  test('should display blood group prominently', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for blood type section
    await expect(page.getByText('CRITICAL: Blood Type')).toBeVisible();
    await expect(page.getByText('O+')).toBeVisible();
  });

  test('should show allergies section', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for allergies
    await expect(page.getByText('ALLERGIES')).toBeVisible();
    await expect(page.getByText('Penicillin')).toBeVisible();
    await expect(page.getByText('Peanuts')).toBeVisible();
  });

  test('should display medical conditions', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for medical conditions
    await expect(page.getByText('Medical Conditions')).toBeVisible();
    await expect(page.getByText('Hypertension')).toBeVisible();
  });

  test('should show current medications', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for medications
    await expect(page.getByText('Current Medications')).toBeVisible();
    await expect(page.getByText(/Lisinopril.*daily/i)).toBeVisible();
  });

  test('should display emergency contact information', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for emergency contact section
    await expect(page.getByText('Emergency Contact')).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('Spouse')).toBeVisible();
    
    // Check phone number is a clickable link
    const phoneLink = page.getByRole('link', { name: /\+1 \(555\) 123-4567/i });
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', 'tel:+1 (555) 123-4567');
  });

  test('should have action buttons for responders', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for action buttons
    await expect(page.getByRole('button', { name: 'Print Emergency Info' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Contact Emergency Contact' })).toBeVisible();
  });

  test('should show blockchain note in footer', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    // Check for blockchain information note
    await expect(page.getByText(/stored on the blockchain/i)).toBeVisible();
    await expect(page.getByText(/accessible only through emergency QR codes/i)).toBeVisible();
  });
});

test.describe('Emergency Responder Page - Navigation', () => {
  const testPatientAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  
  test('should have back to home link', async ({ page }) => {
    await page.goto(`http://localhost:3000/emergency/${testPatientAddress}`);
    
    const backLink = page.getByRole('link', { name: 'Back to Home' });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should work with different patient addresses', async ({ page }) => {
    const alternateAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    await page.goto(`http://localhost:3000/emergency/${alternateAddress}`);
    
    // Should load page successfully
    await expect(page.getByRole('heading', { name: 'Emergency Access' })).toBeVisible();
    
    // Should show the provided address
    await expect(page.getByText(alternateAddress)).toBeVisible();
  });
});
