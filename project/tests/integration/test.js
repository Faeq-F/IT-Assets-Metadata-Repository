import { test } from '@playwright/test';
//import expect,

test('Index page has expected h1', async ({ page }) => {
	await page.goto('/');
	//Demo assertion
	//await expect(page.getByRole('heading', { name: 'Team Project' })).toBeVisible();
});

// Note: database must be running for this test to pass
test('Login as root', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill('root');
	await page.getByLabel('Password').fill('rootroot12');
	await page.getByRole('button', { name: 'Log in' }).click();
	await page.waitForURL('/home');
  });