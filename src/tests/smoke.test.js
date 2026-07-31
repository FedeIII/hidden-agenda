import { test, expect } from './fixtures';

test.describe('Smoke', () => {
	test('renders players form', async ({ page, clickOn, get, drag, goToPlay }) => {
		const text = await page.locator('.game').innerText();

		expect(text).toContain('NUMBER OF PLAYERS');
	});

	test('reaches play phase', async ({ page, clickOn, get, drag, goToPlay }) => {
		await goToPlay(2);

		await expect(page.locator('#next-turn')).toHaveText('NEXT TURN');
	});
});
