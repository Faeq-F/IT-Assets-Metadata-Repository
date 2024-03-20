import { test, expect } from '@playwright/test';
const delay = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const time = 500;
const site = 'http://localhost:4173/';

const adminUser = 'root';
const adminPass = 'rootroot12';

const normalUser = 'normal';
const normalPass = 'password123';

const viewerUser = 'viewer';
const viewerPass = 'password123';

test('Test permissions of an admin user ', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill(adminUser);
	await page.getByLabel('Password').fill(adminPass);
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

	await page.goto('/types');
	// Expect button (to create asset type) to be visible
	await expect(page.locator('#assetMaker')).toBeVisible();

	await page.goto('/assets');
	await expect(page.locator('#assetMaker')).toBeVisible();
});

test('Test permissions of a normal user ', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill(normalUser);
	await page.getByLabel('Password').fill(normalPass);
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Navigate to profile and expect to see the "Manage user permissions" button
	await page.goto('/profile');
	await expect(page.getByTitle('Role')).toHaveText('Role: normal');
	await expect(page.getByText('Manage user permissions')).toBeHidden();

	// Expect a normal user to be redirected when attempting to access permissions page
	await page.goto('/permissions');
	await delay(time);
	expect(page.url()).toBe(site + 'profile');

	let url = await page.url();
	if (url == site + 'permissions') {
		// Normal user shouldn't be able to access the permissions page
		test.fail();
	}

	await page.goto('/types');
	// Expect button (to create asset type) to be invisible
	await expect(page.locator('#assetMaker')).toBeHidden();

	await page.goto('/assets');
	await expect(page.locator('#assetMaker')).toBeVisible();
});

test('Test permissions of a viewer user ', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill(viewerUser);
	await page.getByLabel('Password').fill(viewerPass);
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Navigate to profile and expect to see the "Manage user permissions" button
	await page.goto('/profile');
	await expect(page.getByTitle('Role')).toHaveText('Role: viewer');
	await expect(page.getByText('Manage user permissions')).toBeHidden();

	// Expect a viewer user to be redirected when attempting to access permissions page
	await page.goto('/permissions');
	await delay(time);
	expect(page.url()).toBe(site + 'profile');

	let url = await page.url();
	if (url == site + 'permissions') {
		// Viewer user shouldn't be able to access the permissions page
		test.fail();
	}

	await page.goto('/types');
	// Expect button (to create asset type) to be invisible
	await expect(page.locator('#assetMaker')).toBeHidden();

	await page.goto('/assets');
	await expect(page.locator('#assetMaker')).toBeHidden();
});
