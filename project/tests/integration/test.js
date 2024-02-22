import { test, expect } from '@playwright/test';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('Index page has expected h1', async ({ page }) => {
	await page.goto('/');
	//Demo assertion
	//await expect(page.getByRole('heading', { name: 'Team Project' })).toBeVisible();
});

// Note: database must be running for the tests below to run as expected
test('Login as root and sign out', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Username').fill('root');
	await page.getByLabel('Password').fill('rootroot12');
	await page.getByRole('button', { name: 'Log in' }).click();
	// Wait 0.5 seconds for the login to process
	await delay(500);
	expect(page.url()).toBe('http://localhost:4173/home');

	// Navigate to profile and log out
	await page.goto('/profile');
	await page.getByRole('button', { name: 'Logout' }).click();
	await delay(500);
	expect(page.url()).toBe('http://localhost:4173/');
});

test('Invalid login', async ({ page }) => {
	const username = 'invalid';
	const password = 'invalidPassword';

	await page.goto('/');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	await delay(500);

	let url = await page.url();
	if (url == 'http://localhost:4173/home') {
		// An invalid user should not be able to login and reach the home page
		test.fail();
	}
});

test('Create a new user, login as it, delete account and attempt to log back in', async ({
	page
}) => {
	const email = 'test@mail.com';
	const username = 'testUser';
	const password = 'testPass123';
	const passwordCon = 'testPass123';

	await page.goto('/register');
	await page.getByLabel('email').fill(email);
	await page.getByLabel('username').fill(username);
	await page.getByPlaceholder('Enter Password...').fill(password);
	await page.getByPlaceholder('Enter Password again...').fill(passwordCon);
	await page.getByRole('button', { name: 'Create account' }).click();
	// Wait 1 second for the login to process
	await delay(500);
	expect(page.url()).toBe('http://localhost:4173/home');

	// Navigate to profile and delete account
	await page.goto('/profile');
	await page.getByRole('button', { name: 'Delete Account' }).click();
	await delay(500);
	expect(page.url()).toBe('http://localhost:4173/');

	// Attempt to sign back in
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();
	await delay(500);

	let url = await page.url();
	if (url == 'http://localhost:4173/home') {
		// The user should not be able to log back in with the deleted account
		test.fail();
	}
});
