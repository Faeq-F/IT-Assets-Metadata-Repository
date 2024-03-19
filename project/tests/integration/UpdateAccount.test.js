import { test, expect } from '@playwright/test';
const delay = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const time = 500;
const site = 'http://localhost:4173/';

const username = 'username';
const password = 'password123';
const newUsername = 'newUsername';
const newPassword = 'newPassword123';

test.beforeEach('Login as the test account', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Navigate to profile
	await page.goto('/profile');
});

test('Update username & password, attempt to sign in (with old/new details)', async ({ page }) => {
	// Check username is as expected
	await expect(page.getByTitle('Username')).toHaveText('Username: ' + username);

	await page.getByRole('button', { name: 'Update Account details' }).click();
	await page.getByLabel('username').fill(newUsername);
	await page.getByPlaceholder('Enter new Password...').fill(newPassword);
	await page.getByPlaceholder('Enter Password again...').fill(newPassword);
	await page.getByRole('button', { name: 'Update details' }).click();

	// Wait (time) seconds for the update to register
	await delay(time);

	// Check if the username has been updated
	await expect(page.getByTitle('Username')).toHaveText('Username: ' + newUsername);

	// Logout and return login
	await page.getByRole('button', { name: 'Logout' }).click();
	await delay(time);
	expect(page.url()).toBe(site);

	//Attempt to sign in with old details
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	await delay(time);

	let url = await page.url();
	if (url == site + 'home') {
		// User should not be able to login with old details
		test.fail();
	}

	// Sign in with the updated details
	await page.getByLabel('Username').fill(newUsername);
	await page.getByLabel('Password').fill(newPassword);
	await page.getByRole('button', { name: 'Log in' }).click();
	await delay(time);

	expect(page.url()).toBe(site + 'home');
	await page.goto('/profile');
});

test('Update only password', async ({ page }) => {
	// Check username is as expected
	await expect(page.getByTitle('Username')).toHaveText('Username: ' + username);

	await page.getByRole('button', { name: 'Update Account details' }).click();
	await page.getByLabel('username').fill(username);
	await page.getByPlaceholder('Enter new Password...').fill(newPassword);
	await page.getByPlaceholder('Enter Password again...').fill(newPassword);
	await page.getByRole('button', { name: 'Update details' }).click();

	// Wait (time) seconds for the update to register
	await delay(time);

	// Check if the username remains
	await expect(page.getByTitle('Username')).toHaveText('Username: ' + username);
});

test.afterEach('Change details back', async ({ page }) => {
	// Change details back
	await page.getByRole('button', { name: 'Update Account details' }).click();
	await page.getByLabel('username').fill(username);
	await page.getByPlaceholder('Enter new Password...').fill(password);
	await page.getByPlaceholder('Enter Password again...').fill(password);
	await page.getByRole('button', { name: 'Update details' }).click();

	await delay(time);

	// Check if the username has been changed back
	await expect(page.getByTitle('Username')).toHaveText('Username: ' + username);
});
