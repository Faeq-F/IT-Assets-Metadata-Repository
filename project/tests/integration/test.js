import { test } from '@playwright/test';
//import expect,

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	//Demo assertion
	//await expect(page.getByRole('heading', { name: 'Team Project' })).toBeVisible();
});
