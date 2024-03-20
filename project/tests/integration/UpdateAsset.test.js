import { test, expect } from '@playwright/test';
const delay = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const time = 500;
const site = 'http://localhost:4173/';

const username = 'admin';
const password = 'password123';

test("Test update asset", async ({page}) => {
    await page.goto('/');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Go to the assets page and test if the RBAC asset is visible
	await page.goto('/assets');
	await expect(page.locator('#ButtonActions').first()).toBeVisible();
	await expect(page.getByText('RBAC', { exact: true })).toBeVisible();

	// Select the RBAC asset 
	await page.locator('#ButtonActions').first().click();
	await page.getByRole('button', { name: 'Edit' }).click();

	// Edit its attributes
	await page.getByPlaceholder('RBAC', { exact: true }).fill("RBAC_EDIT");
	await page.getByPlaceholder('gitlab.com/src/RBAC', { exact: true }).fill("gitlab.com/src/RBAC_EDIT");
	await page.getByPlaceholder('gitlab.com/docs/RBAC', { exact: true }).fill("gitlab.com/docs/RBAC_EDIT");
	await page.getByPlaceholder('8', { exact: true }).fill('9');
	await page.getByRole('button', { name: 'Update' }).click();
	await delay(time);

	// Check that the attributes have been changed
	await expect(page.getByText('RBAC_EDIT', { exact: true })).toBeVisible();
	await expect(page.getByText('gitlab.com/src/RBAC_EDIT', { exact: true })).toBeVisible();
	await expect(page.getByText('gitlab.com/docs/RBAC_EDIT')).toBeVisible();
	await expect(page.getByText('Version count: 9')).toBeVisible();

	// Edit back 
	await page.locator('#ButtonActions').first().click();
	await page.getByRole('button', { name: 'Edit' }).click();
	
	await page.getByPlaceholder('RBAC_EDIT', { exact: true }).fill("RBAC");
	await page.getByPlaceholder('gitlab.com/src/RBAC_EDIT', { exact: true }).fill("gitlab.com/src/RBAC");
	await page.getByPlaceholder('gitlab.com/docs/RBAC_EDIT', { exact: true }).fill("gitlab.com/docs/RBAC");
	await page.getByPlaceholder('9', { exact: true }).fill('8');
	
	await page.getByRole('button', { name: 'Update' }).click();
	await delay(time);

	// Check if they have changed back
	await expect(page.getByText('RBAC', { exact: true })).toBeVisible();
	await expect(page.getByText('gitlab.com/src/RBAC', { exact: true })).toBeVisible();
	await expect(page.getByText('gitlab.com/docs/RBAC')).toBeVisible();
	await expect(page.getByText('Version count: 8')).toBeVisible();
})