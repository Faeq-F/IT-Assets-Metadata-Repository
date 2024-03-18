import { test, expect } from '@playwright/test';
const delay = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const time = 500;
const site = 'http://localhost:4173/';

test('Test permissions of an admin user ', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill('root');
	await page.getByLabel('Password').fill('rootroot12');
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Navigate to profile and expect to see the "Manage user permissions" button
	await page.goto('/profile');
    await expect(page.getByTitle('Role')).toHaveText('Role: admin');
	await expect(page.getByText('Manage user permissions')).toBeVisible();
    
    // Expect the admin user can navigate to the permissions page
    await page.goto('/permissions');
    await expect(page.getByRole('button', { name: 'Update user permissions' })).toBeVisible();
});