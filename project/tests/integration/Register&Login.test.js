import { test, expect } from '@playwright/test';
const delay = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
const time = 500;
const site = 'http://localhost:4173/';

// Note: database must be running for the tests below to run as expected
test('Login as root and sign out', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill('root');
	await page.getByLabel('Password').fill('rootroot12');
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Navigate to profile and log out
	await page.goto('/profile');
	await page.getByRole('button', { name: 'Logout' }).click();
	await delay(time);
	expect(page.url()).toBe(site);
});

test('Invalid login', async ({ page }) => {
	const username = 'invalid';
	const password = 'invalidPassword';

	await page.goto('/');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	await delay(time);

	let url = await page.url();
	if (url == site + 'home') {
		// An invalid user should not be able to login and reach the home page
		test.fail();
	}
});

test('Create a new user, login as it, delete account and attempt to log back in', async ({
	page
}) => {
	const email = 'tests@mail.com';
	const username = 'testUser';
	const password = 'password123';

	await page.goto('/register');
	await page.getByLabel('email').fill(email);
	await page.getByLabel('username').fill(username);
	await page.getByPlaceholder('Enter Password...').fill(password);
	await page.getByPlaceholder('Enter Password again...').fill(password);

	await expect(page.getByRole('button', { name: 'Create account' })).toBeEnabled();
	await page.getByRole('button', { name: 'Create account' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	// Navigate to profile and delete account
	await page.goto('/profile');

	// Check if the confirmation prompt is created and accept it
	page.on('dialog', async (dialog) => {
		expect(dialog.type()).toContain('confirm');
		expect(dialog.message()).toContain('Are you sure you want to delete your account?');

		await dialog.accept();
	});

	await page.getByRole('button', { name: 'Delete Account' }).click();
	await delay(time);

	expect(page.url()).toBe(site);

	// Attempt to sign back in
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	await delay(time);

	let url = await page.url();
	if (url == site + 'home') {
		// The user should not be able to log back in with the deleted account
		test.fail();
	}
});

test('Redirection test 1 - signed in', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill('root');
	await page.getByLabel('Password').fill('rootroot12');
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait (time) seconds for the login to process
	await delay(time);
	expect(page.url()).toBe(site + 'home');

	await page.goto('/');
	await delay(time);
	// Page shoudl remain the same as the user is redirected back to home
	expect(page.url()).toBe(site + 'home');

	let url = await page.url();
	if (url == site) {
		// The user should not be able to redirect back to the login if signed in
		test.fail();
	}
});

test('Redirection test 2 - not signed in', async ({ page }) => {
	await page.goto('/home');
	// Wait (time) seconds to process redirection
	await delay(time);
	expect(page.url()).toBe(site);

	let url = await page.url();
	if (url == site + 'home') {
		// The user should not be able to direct to the home page if not signed in
		test.fail();
	}

	await page.goto('/profile');
	await delay(time);
	expect(page.url()).toBe(site);

	url = await page.url();
	if (url == site + 'profile') {
		test.fail();
	}

	await page.goto('/assets');
	await delay(time);
	expect(page.url()).toBe(site);

	url = await page.url();
	if (url == site + 'assets') {
		test.fail();
	}

	await page.goto('/types');
	await delay(time);
	expect(page.url()).toBe(site);

	url = await page.url();
	if (url == site + 'types') {
		test.fail();
	}
});
