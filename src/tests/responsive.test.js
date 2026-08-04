import { test, expect } from './fixtures';

// A phone is the point of the pointer-event drag work, so the layout has to survive one. These
// sizes are deliberately outside the 800x600 the rest of the suite is pinned to.
const PORTRAIT = { width: 390, height: 844 };
const LANDSCAPE = { width: 844, height: 390 };

// Revealing used to grow the middle action group to four items — the two buttons plus a chip per
// revealed alignment — which was wider than a phone and, being centred, hung off *both* edges at
// once. Reveal is a screen of its own now, so the bar never grows; what has to survive a phone is the
// screen, and the bar afterwards.

async function whatStandsOutSideways(page, selector) {
	return page.evaluate(sel => {
		// The board deliberately renders a hexagon past each edge, so .game is scrollable sideways
		// even though it clips. A click can leave it scrolled, which would measure a shifted layout.
		document.querySelector('.game').scrollLeft = 0;

		const width = document.documentElement.clientWidth;

		return [...document.querySelectorAll(sel)]
			.filter(el => {
				const box = el.getBoundingClientRect();

				return box.left < -1 || box.right > width + 1;
			})
			.map(el => el.id || el.textContent.trim());
	}, selector);
}

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
			// scroll it into view first, which only works because the container scrolls now. Only snipe,
			// because accuse and reveal put a screen over everything.
			await page.click('#snipe');
			await expect(page.locator('#snipe')).toBeInViewport();
		});

		test('the claim control fits inside its HQ', async ({ page, goToPlay }) => {
			await goToPlay(2);

			// "Claim Control" across the top of the card used to be wider than a phone-sized HQ, so it
			// rendered as "Claim Contro" cut off mid-word. It is a line at the foot of the card now and
			// each direction words it differently, so the same check still earns its keep.
			for (const team of [0, 1, 2, 3]) {
				const overflow = await page.locator(`#claim-${team}`).evaluate(el => el.scrollWidth - el.clientWidth);

				expect(overflow).toBeLessThanOrEqual(1);
			}
		});

		test('the reveal screen fits, and so does the bar afterwards', async ({ page, goToPlay }) => {
			await goToPlay(2);

			await page.click('#reveal');
			expect(await whatStandsOutSideways(page, '#reveal-friend, #reveal-foe, #reveal-close')).toEqual([]);
			await expect(page.locator('#reveal-friend')).toBeInViewport();

			await page.click('#reveal-friend');
			await page.click('#reveal-foe');
			await page.click('#reveal-close');

			expect(await whatStandsOutSideways(page, '#accuse, #reveal, #friend-foe, #snipe')).toEqual([]);
			await expect(page.locator('#accuse')).toBeInViewport();
			await expect(page.locator('#reveal')).toBeInViewport();
		});

		// Accusing used to take over the same middle group and was the widest thing that ever went in
		// it: at six players it ran a hundred pixels off each edge, and the seats at the far left were
		// not merely clipped but impossible to tap. It is a screen now, and the seats wrap — but the
		// thing that must hold is the same one, so the assertion is unchanged.
		test('every seat can be accused at six players', async ({ page, goToPlay }) => {
			await page.click('#players6');
			await goToPlay(6);
			await page.click('#accuse');

			expect(await whatStandsOutSideways(page, '[id^="accuse-player-"]')).toEqual([]);

			await page.click('#accuse-player-1');
			await expect(page.locator('#accuse-friend')).toBeVisible();
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

		test('the reveal screen fits, and so does the bar afterwards', async ({ page, goToPlay }) => {
			await goToPlay(2);

			await page.click('#reveal');
			expect(await whatStandsOutSideways(page, '#reveal-friend, #reveal-foe, #reveal-close')).toEqual([]);

			await page.click('#reveal-friend');
			await page.click('#reveal-foe');
			await page.click('#reveal-close');

			expect(await whatStandsOutSideways(page, '#accuse, #reveal, #friend-foe, #snipe')).toEqual([]);
			await expect(page.locator('#accuse')).toBeInViewport();
			await expect(page.locator('#reveal')).toBeInViewport();
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

// An online game has one control the hot-seat specs above can never see: LEAVE. It shares the
// FRIEND & FOE group rather than taking a fourth of its own, because `Actions` is flex-basis 33%
// three ways and this is the layout with no slack in it — the landscape phone, where the bar was
// once off the bottom of the screen entirely.
//
// Reachability rather than height is what this asserts, deliberately. The projected overlay boxes
// are recomputed after the first layout, so the board's scroll height is briefly larger than the
// viewport with or without any of this; what has to hold is that every control can be got at.
test.describe('PHONE LAYOUT, ONLINE', () => {
	test('the action bar fits on its side with LEAVE in it', async ({ browser }) => {
		const contexts = [];
		const pages = [];

		for (const _seat of ['ANA', 'BEA']) {
			const context = await browser.newContext({ viewport: LANDSCAPE });

			contexts.push(context);
			pages.push(await context.newPage());
		}

		const [host, guest] = pages;

		try {
			await host.goto('/');
			await host.fill('#lobby-name', 'ANA');
			await host.click('#lobby-create');

			const code = await host.locator('#lobby-room-code').innerText();

			await guest.goto(`/#/r/${code}`);
			await guest.fill('#lobby-name', 'BEA');
			await guest.fill('#lobby-code', code);
			await guest.click('#lobby-join');
			await expect(guest.locator('#lobby-room-code')).toBeVisible();

			await host.click('#lobby-start');
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();

			expect(await whatStandsOutSideways(host, '#snipe, #accuse, #reveal, #friend-foe, #leave-game')).toEqual([]);

			for (const id of ['#snipe', '#accuse', '#reveal', '#friend-foe', '#leave-game', '#next-turn']) {
				await expect(host.locator(id)).toBeInViewport();
			}

			// And the screen it opens fits too, which is the whole point of it being a screen.
			await host.click('#leave-game');
			expect(await whatStandsOutSideways(host, '#leave-confirm, #leave-close')).toEqual([]);
			await expect(host.locator('#leave-confirm')).toBeInViewport();
		} finally {
			for (const context of contexts) {
				await context.close();
			}
		}
	});
});
