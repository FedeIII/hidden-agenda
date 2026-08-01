import { test, expect } from './fixtures';

// A phone is the point of the pointer-event drag work, so the layout has to survive one. These
// sizes are deliberately outside the 800x600 the rest of the suite is pinned to.
const PORTRAIT = { width: 390, height: 844 };
const LANDSCAPE = { width: 844, height: 390 };

// Was `overflow: hidden`, so anything that did not fit was not merely off-screen, it was
// unreachable. Whatever else changes, that must not come back.
async function nothingIsUnreachable(page) {
	return page.evaluate(() => {
		const game = document.querySelector('.game');
		const style = getComputedStyle(game);

		return {
			clipped: style.overflowY === 'hidden' && game.scrollHeight > game.clientHeight,
			overflowY: style.overflowY,
		};
	});
}

test.describe('PHONE LAYOUT', () => {
	test.describe('upright', () => {
		test.use({ viewport: PORTRAIT });

		test('every action button can be reached and used', async ({ page, goToPlay }) => {
			await goToPlay(2);

			expect((await nothingIsUnreachable(page)).clipped).toBe(false);

			// The whole bar was off the bottom of a phone, and with the old overflow: hidden it was
			// not merely off-screen but gone.
			for (const id of ['#snipe', '#accuse', '#reveal']) {
				await expect(page.locator(id)).toBeVisible();
			}

			// Clicking proves it is genuinely usable rather than merely present: playwright has to
			// scroll it into view first, which only works because the container scrolls now.
			// Only snipe — accuse swaps the bar for its own menu.
			await page.click('#snipe');
			await expect(page.locator('#snipe')).toBeInViewport();
		});

		test('the claim button fits inside its HQ', async ({ page, goToPlay }) => {
			await goToPlay(2);

			// "Claim Control" used to be wider than a phone-sized HQ, so it rendered as
			// "Claim Contro" cut off mid-word.
			for (const team of [0, 1, 2, 3]) {
				const overflow = await page.locator(`#claim-${team}`).evaluate(el => el.scrollWidth - el.clientWidth);

				expect(overflow).toBeLessThanOrEqual(1);
			}
		});

		test('all four HQs and the board are present', async ({ page, goToPlay }) => {
			await goToPlay(2);

			for (const team of [0, 1, 2, 3]) {
				await expect(page.locator(`#store-${team}`)).toBeVisible();
			}

			await expect(page.locator('#hex-3-3')).toBeVisible();
		});
	});

	test.describe('on its side', () => {
		test.use({ viewport: LANDSCAPE });

		test('the whole game fits without scrolling', async ({ page, goToPlay }) => {
			await goToPlay(2);

			const fits = await page.evaluate(() => {
				const game = document.querySelector('.game');

				// A few pixels of slack: sub-pixel rounding should not fail this.
				return game.scrollHeight - game.clientHeight <= 4;
			});

			expect(fits).toBe(true);
			await expect(page.locator('#snipe')).toBeInViewport();
			await expect(page.locator('#next-turn')).toBeInViewport();
		});
	});
});

test.describe('SCORE BREAKDOWN', () => {
	// The breakdown is only worth showing if it agrees with the score it claims to explain. Every
	// signed term carries data-term; they must add up to the total beside them.
	async function everyRowAddsUp(page) {
		return page.evaluate(() =>
			[...document.querySelectorAll('[data-player]')].map(row => ({
				player: row.dataset.player,
				sum: [...row.querySelectorAll('[data-term]')].reduce((total, el) => total + Number(el.dataset.term), 0),
				total: Number(row.querySelector('[data-total]').dataset.total),
				shown: row.querySelector('[data-total]').textContent.trim(),
			})),
		);
	}

	for (const [name, viewport] of [
		['desktop', { width: 1280, height: 800 }],
		['upright', PORTRAIT],
	]) {
		test(`the terms add up to the total on ${name}`, async ({ page }) => {
			await page.setViewportSize(viewport);
			await page.goto('/?test=endgame');
			await expect(page.locator('[data-player]').first()).toBeVisible();

			const rows = await everyRowAddsUp(page);

			expect(rows.length).toBeGreaterThan(1);

			for (const row of rows) {
				expect(row.sum, `${row.player}: terms should make the total`).toEqual(row.total);
				expect(row.shown).toEqual(String(row.total));
			}
		});
	}

	// A friend's team always adds and a foe's always subtracts. Taking the sign from the number
	// instead made a foe worth nothing read "+ 0", which says the opposite of what it means.
	test('a friend always adds and a foe always subtracts', async ({ page }) => {
		await page.goto('/?test=endgame');
		await expect(page.locator('[data-player]').first()).toBeVisible();

		const groups = await page.evaluate(() =>
			[...document.querySelectorAll('[data-alignment]')].map(group => ({
				alignment: group.dataset.alignment,
				amount: group.querySelector('[data-term]').textContent.trim(),
			})),
		);

		expect(groups.length).toBeGreaterThan(1);

		for (const { alignment, amount } of groups) {
			expect(amount.startsWith(alignment === 'friend' ? '+' : '−'), `${alignment} showed "${amount}"`).toBe(true);
		}

		// And the case that was actually wrong is present in this fixture, so the test bites.
		expect(groups.some(g => g.alignment === 'foe' && g.amount === '− 0')).toBe(true);
	});
});
