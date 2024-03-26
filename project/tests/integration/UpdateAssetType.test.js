import { test, expect } from '@playwright/test';
const delay = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const time = 500;
const site = 'http://localhost:4173/';

const username = 'admin';
const password = 'password123';

test('Test update asset type', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Go to the types page and test if the type "with every data type" is visible
	await page.goto('/types');
	await expect(page.locator('#ButtonActions').first()).toBeVisible();
	await expect(page.getByText('A type with every data type', { exact: true })).toBeVisible();

	// Select the type "A type with every data type"
	await page.locator('#ButtonActions').first().click();
	await page.getByRole('button', { name: 'Edit' }).click();

	// Edit its attributes
	await page
		.getByPlaceholder('A type with every data type', { exact: true })
		.fill('A type with every data type_EDIT');
	await page.getByPlaceholder('field 1', { exact: true }).fill('field 1_EDIT');

	await page.getByPlaceholder('field 2', { exact: true }).fill('field 2_EDIT');

	// Add new field
	await page.getByPlaceholder('Field name, e.g. Author', { exact: true }).fill('NEW FIELD');
	await page.locator('#metadataFieldAdder').first().click();

	await page.getByRole('button', { name: 'Update' }).click();
	await delay(time);

	// Check the changes have been made
	await expect(page.getByText('A type with every data type_EDIT', { exact: true })).toBeVisible();
	await expect(page.getByText('field 1_EDIT')).toBeVisible();
	await expect(page.getByText('field 2_EDIT')).toBeVisible();
	await expect(page.getByText('NEW FIELD')).toBeVisible();

	// Edit back
	await page.locator('#ButtonActions').first().click();
	await page.getByRole('button', { name: 'Edit' }).click();

	await page
		.getByPlaceholder('A type with every data type_EDIT', { exact: true })
		.fill('A type with every data type');
	await page.getByPlaceholder('field 1_EDIT', { exact: true }).fill('field 1');
	await page.getByPlaceholder('field 2_EDIT', { exact: true }).fill('field 2');

	// Remove field
	await page.locator('#delete').last().click();

	await page.getByRole('button', { name: 'Update' }).click();
	await delay(time);

	// Check that they have been changed back
	await expect(page.getByText('A type with every data type', { exact: true })).toBeVisible();
	await expect(page.getByText('field 1')).toBeVisible();
	await expect(page.getByText('field 2')).toBeVisible();
	await expect(page.getByText('NEW FIELD')).toBeHidden();
});
