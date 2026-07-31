import { test, expect } from './fixtures';

// Two independent browser contexts are two independent players. This is the only way to check the
// things that matter about multiplayer from the outside: that a player cannot act on somebody
// else's turn, and cannot see their cards. The equivalent test in puppeteer would have been a
// contortion; here a context is just a second browser.

async function joinRoom(page, { code, name }) {
	await page.goto(code ? `/#/r/${code}` : '/');

	if (!code) {
		await page.click('#play-online-btn');
	}

	await page.fill('#lobby-name', name);

	if (code) {
		await page.fill('#lobby-code', code);
		await page.click('#lobby-join');
	} else {
		await page.click('#lobby-create');
	}

	await expect(page.locator('#lobby-room-code')).toBeVisible();

	return page.locator('#lobby-room-code').innerText();
}

// Host creates, guest joins by code, host starts, both confirm their cards.
async function twoPlayerGame(browser) {
	const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
	const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
	const host = await hostContext.newPage();
	const guest = await guestContext.newPage();

	const code = await joinRoom(host, { name: 'ANA' });
	await joinRoom(guest, { code, name: 'BEA' });

	await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
	await host.click('#lobby-start');

	// Each player now sees their own two cards and nothing else.
	await expect(host.locator('#alingnment-card-friend')).toBeVisible();
	await expect(guest.locator('#alingnment-card-friend')).toBeVisible();

	return { hostContext, guestContext, host, guest, code };
}

test.describe('ONLINE', () => {
	test('two players reach the board through a shared room code', async ({ browser }) => {
		const { hostContext, guestContext, host, guest, code } = await twoPlayerGame(browser);

		try {
			expect(code).toMatch(/^[A-Z0-9]{4}$/);

			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');

			// Both land on the board, which only happens once the server says everyone is ready.
			await expect(host.locator('#next-turn')).toBeVisible();
			await expect(guest.locator('#next-turn')).toBeVisible();
			await expect(host.locator('#pz-0-A1')).toBeVisible();
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// Secrecy on the wire is asserted properly in the server specs, against the serialised frame.
	// What this adds is the user-facing half: each screen shows its own pair of cards and is
	// addressed to its own player.
	test('each screen shows that player’s own cards and nobody else’s', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			const teams = ['BLACK', 'RED', 'WHITE', 'YELLOW'];

			for (const [page, name] of [
				[host, 'ANA'],
				[guest, 'BEA'],
			]) {
				await expect(page.locator('.game')).toContainText(`${name}, these are yours`);

				const friend = (await page.locator('#alingnment-card-friend').innerText()).trim();
				const foe = (await page.locator('#alingnment-card-foe').innerText()).trim();

				expect(teams).toContain(friend);
				expect(teams).toContain(foe);
				// A player is never their own friend and foe of the same team.
				expect(friend).not.toEqual(foe);
			}

			// Neither screen is addressed to the other player.
			await expect(host.locator('.game')).not.toContainText('BEA, these are yours');
			await expect(guest.locator('.game')).not.toContainText('ANA, these are yours');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	test('the player who is not on turn cannot move a piece', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();
			await expect(guest.locator('#next-turn')).toBeVisible();

			// ANA (host) is first, so the guest's clicks must do nothing at all.
			await guest.click('#pz-0-A1');
			await guest.click('#hex-1-1');

			await expect(guest.locator('#hex-1-1')).toHaveText('');
			await expect(host.locator('#hex-1-1')).toHaveText('');

			// The same two clicks from the seat on turn do work, and reach the other screen.
			await host.click('#pz-0-A1');
			await host.click('#hex-1-1');

			await expect(host.locator('#hex-1-1 > *')).toHaveId('pz-0-A1');
			await expect(guest.locator('#hex-1-1 > *')).toHaveId('pz-0-A1');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});
});
