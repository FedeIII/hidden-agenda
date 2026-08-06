import { test, expect } from './fixtures';

// The friend-and-foe screen: your own two cards, at the size they were dealt at.
//
// The assertion that matters most is the online one. The old inline reminder read
// `players.find(player => player.turn)`, so on somebody else's turn it went looking for *their*
// pair — the one thing this game must never show. It only looked harmless because the server
// redacts what it sends, so the fields arrived null and the cards came up blank instead of lying.

const CARDS = { friend: '#friend-foe-friend', foe: '#friend-foe-foe' };

test.describe('HOT SEAT', () => {
	test.beforeEach(async ({ goToPlay }) => {
		await goToPlay(2);
	});

	test('opens a full screen rather than chips in the action bar', async ({ page }) => {
		await expect(page.locator('#friend-foe-screen')).toHaveCount(0);

		await page.click('#friend-foe');

		const screen = page.locator('#friend-foe-screen');
		await expect(screen).toBeVisible();

		// Full screen means exactly that: it covers the viewport, so the board underneath is neither
		// visible nor clickable while somebody is reading their cards.
		const covers = await screen.evaluate(el => {
			const box = el.getBoundingClientRect();

			return box.width >= window.innerWidth && box.height >= window.innerHeight;
		});

		expect(covers).toBe(true);
	});

	test('keeps the cards covered until the right person says they are looking', async ({ page }) => {
		// One screen, several people. A pair of cards that appears the instant a button is pressed is
		// a pair of cards everybody at the table has seen.
		await page.click('#friend-foe');

		await expect(page.locator('#friend-foe-eyes')).toContainText("only for FEDE's eyes");
		await expect(page.locator(CARDS.friend)).toHaveCount(0);
		await expect(page.locator(CARDS.foe)).toHaveCount(0);

		await page.click('#friend-foe-confirm');

		await expect(page.locator(CARDS.friend)).toBeVisible();
		await expect(page.locator(CARDS.foe)).toBeVisible();
	});

	test('shows the same pair the game dealt', async ({ page }) => {
		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		// A team name, not an empty card. The blank card is exactly how the online bug hid itself.
		await expect(page.locator(CARDS.friend)).not.toBeEmpty();
		await expect(page.locator(CARDS.foe)).not.toBeEmpty();
	});

	test('puts it away again', async ({ page }) => {
		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');
		await page.click('#friend-foe-close');

		await expect(page.locator('#friend-foe-screen')).toHaveCount(0);
		// And the board is back, rather than the screen having replaced the game.
		await expect(page.locator('#pz-0-A1')).toBeVisible();
	});

	test('blocks the board and the hand-over while it is up', async ({ page, clickOn }) => {
		// This is what makes the leak impossible, and it is why there is no auto-close on a turn
		// change: NEXT TURN is behind the screen, so nobody can hand the turn to the next player
		// without putting the cards away first.
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		// What is actually under the pointer over the board, and over the button that would pass the
		// turn on. Both answers have to be the screen.
		const blocked = await page.evaluate(() => {
			const topmostOver = selector => {
				const box = document.querySelector(selector).getBoundingClientRect();
				const at = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);

				return at && at.closest('#friend-foe-screen') !== null;
			};

			return { board: topmostOver('#hex-3-3'), handOver: topmostOver('#next-turn') };
		});

		expect(blocked).toEqual({ board: true, handOver: true });
	});

	test('redacts the rest of the table', async ({ page }) => {
		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		const ledger = page.locator('#friend-foe-ledger');
		await expect(ledger).toBeVisible();
		await expect(ledger).toContainText('FEDE');
		await expect(ledger).toContainText('SARA');

		// Two black bars: the other player's pair is present as something withheld rather than absent.
		await expect(ledger.locator('[aria-label="withheld"]')).toHaveCount(2);
	});

	test('says what every player is on, and takes fifty off when one goes public', async ({ page }) => {
		// The baseline is public for the whole table — it is built out of `revealed`, the same field the
		// bars beside it are built out of — so it is shown for everybody, not just for you.
		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		// Read as a number rather than as text: the row's words are the direction's business.
		await expect(page.locator('#ledger-score-FEDE')).toHaveAttribute('data-base', '100');
		await expect(page.locator('#ledger-score-SARA')).toHaveAttribute('data-base', '100');
		await expect(page.locator('#friend-foe-base-note')).toContainText('the teams are counted at the end');

		await page.click('#friend-foe-close');

		// FEDE pays for one alignment. Hers moves; SARA's does not.
		await page.click('#reveal');
		await page.click('#reveal-friend');
		await page.click('#reveal-close');

		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		await expect(page.locator('#ledger-score-FEDE')).toHaveAttribute('data-base', '50');
		await expect(page.locator('#ledger-score-SARA')).toHaveAttribute('data-base', '100');
	});
});

test.describe('ONLINE', () => {
	// Two contexts are two players. The point of this whole block is that the screen answers "what
	// are MY cards", never "what are the cards of whoever is on turn".
	async function seatTwo(browser) {
		const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const host = await hostContext.newPage();
		const guest = await guestContext.newPage();

		await host.goto('/');
		await host.fill('#lobby-name', 'ANA');
		await host.click('#lobby-menu-start');
		await host.click('#lobby-create');
		await expect(host.locator('#lobby-room-code')).toBeVisible();
		const code = await host.locator('#lobby-room-code').innerText();

		await guest.goto(`/#/r/${code}`);
		await guest.fill('#lobby-name', 'BEA');
		await guest.click('#lobby-menu-join');
		await guest.fill('#lobby-code', code);
		await guest.click('#lobby-join');
		await expect(guest.locator('#lobby-room-code')).toBeVisible();

		await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
		await host.click('#lobby-start');
		await expect(host.locator('#alignments-btn')).toBeVisible();
		await expect(guest.locator('#alignments-btn')).toBeVisible();

		// Each seat is dealt its own pair and only ever receives its own, so this is the truth to
		// compare the in-game screen against.
		// Team indices off the cards, which is exact and survives the cards carrying words of their own.
		const team = (page, which) => page.locator(`#alingnment-card-${which} [data-team]`).getAttribute('data-team');
		const dealt = {
			ana: { friend: await team(host, 'friend'), foe: await team(host, 'foe') },
			bea: { friend: await team(guest, 'friend'), foe: await team(guest, 'foe') },
		};

		await host.click('#alignments-btn');
		await guest.click('#alignments-btn');
		await expect(host.locator('#pz-0-A1')).toBeVisible();
		await expect(guest.locator('#pz-0-A1')).toBeVisible();

		return { hostContext, guestContext, host, guest, dealt };
	}

	test('shows a seat its OWN cards, not the turn holder’s', async ({ browser }) => {
		const { hostContext, guestContext, host, guest, dealt } = await seatTwo(browser);

		try {
			// ANA is on turn. BEA is not, and BEA's screen must still be about BEA.
			await expect(host.locator('#turn-player')).toHaveText('ANA');

			await guest.click('#friend-foe');
			await expect(guest.locator(`${CARDS.friend} [data-team]`)).toHaveAttribute('data-team', dealt.bea.friend);
			await expect(guest.locator(`${CARDS.foe} [data-team]`)).toHaveAttribute('data-team', dealt.bea.foe);

			// And the host's screen is about the host, which happens to also be the turn holder — so
			// this half would have passed even with the bug. It is here to pin both halves.
			await host.click('#friend-foe');
			await expect(host.locator(`${CARDS.friend} [data-team]`)).toHaveAttribute('data-team', dealt.ana.friend);
			await expect(host.locator(`${CARDS.foe} [data-team]`)).toHaveAttribute('data-team', dealt.ana.foe);
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	test('needs no confirmation, because the screen is already yours', async ({ browser }) => {
		const { hostContext, guestContext, guest } = await seatTwo(browser);

		try {
			await guest.click('#friend-foe');

			// Straight to the cards. The hot-seat gate exists because that screen is shared; this one
			// is not, and a gate there is friction with nothing behind it.
			await expect(guest.locator('#friend-foe-confirm')).toHaveCount(0);
			await expect(guest.locator(CARDS.friend)).toBeVisible();
			await expect(guest.locator('#friend-foe-eyes')).toContainText('nobody else can see these');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	test('stays open when somebody else takes their turn', async ({ browser }) => {
		// Your own two cards do not change because another seat moved, so closing the screen under a
		// player who is reading them would be rude rather than careful. Hot-seat is the case that
		// needs protecting, and there the screen covers NEXT TURN.
		const { hostContext, guestContext, host, guest } = await seatTwo(browser);

		try {
			await guest.click('#friend-foe');
			await expect(guest.locator(CARDS.friend)).toBeVisible();

			await host.click('#pz-0-A1');
			await host.click('#hex-1-1');
			await host.click('#hex-2-2');
			await host.click('#next-turn');
			await expect(guest.locator('#turn-player')).toHaveText('BEA');

			await expect(guest.locator('#friend-foe-screen')).toBeVisible();
			await expect(guest.locator(CARDS.friend)).toBeVisible();
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	test('never carries another seat’s pair into the page at all', async ({ browser }) => {
		const { hostContext, guestContext, guest } = await seatTwo(browser);

		try {
			await guest.click('#friend-foe');
			await expect(guest.locator(CARDS.friend)).toBeVisible();

			// The strongest form of the rule: not merely "the cards show mine", but "the other seat's
			// pair is nowhere in this document". The ledger redacts it and the server never sent it.
			const ledger = guest.locator('#friend-foe-ledger');
			await expect(ledger).toContainText('ANA');
			await expect(ledger.locator('[aria-label="withheld"]')).toHaveCount(2);

			// What the other seat is *on*, however, is public and does arrive: it is built out of
			// `revealed`, which redaction deliberately leaves alone. A hundred each, nothing spent yet.
			await expect(guest.locator('#ledger-score-ANA')).toHaveAttribute('data-base', '100');
			await expect(guest.locator('#ledger-score-BEA')).toHaveAttribute('data-base', '100');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});
});
