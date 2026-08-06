import { test, expect } from './fixtures';

// Ratings from the outside, in a real browser. The arithmetic is covered in unit/rating.test.js and the
// wire in unit/server.test.js — what is left, and what only a browser can check, is that a number the
// server derived actually reaches the three places a player reads it, and that the automatch button
// puts two strangers at one table.
//
// Every spec here is online, so none of them carries `?hotseat`: the index *is* the lobby, and the test
// server's HA_SKIN covers the skin the shared fixture would otherwise have to pin.

// `into` opens the submenu the caller is about to act in — 'start' for automatch/new room, 'join'
// for the finder/join-by-code — since the index itself is only the name, the bot check and the
// three doors out of it now.
async function openLobby(page, name, into) {
	await page.goto('/');
	await page.fill('#lobby-name', name);

	if (into) {
		await page.click(`#lobby-menu-${into}`);
	}
}

// The test server keeps rooms between runs and the suite is fullyParallel, so anything that reads the
// public list has to look for a name that cannot collide with another spec or an earlier run.
//
// Keep the prefix short. `MAX_ROOM_NAME_LENGTH` is 24 and the lobby's field enforces it, so a longer
// name is silently truncated on the way in — and then the row is there under a name the selector is not
// looking for, which fails as "no such room" rather than as anything about lengths.
function uniqueRoomName(prefix) {
	return `${prefix}-${Date.now()}`.slice(0, 24);
}

async function twoContexts(browser) {
	// Two contexts are two browsers, which is what makes them two *rated players*: the id a rating is
	// keyed by lives in localStorage, so sharing a context would be one player playing themselves.
	const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
	const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });

	return { hostContext, guestContext, host: await hostContext.newPage(), guest: await guestContext.newPage() };
}

test.describe('RATINGS ON SCREEN', () => {
	// A rating that only exists on the server is not a feature. This is the waiting room: the one place
	// where you can see who you have drawn before the cards come out.
	test('the waiting room shows what every seat is rated', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);

		try {
			await openLobby(host, 'ANA', 'start');
			await host.click('#lobby-create');

			const code = await host.locator('#lobby-room-code').innerText();

			await openLobby(guest, 'BEA', 'join');
			await guest.fill('#lobby-code', code);
			await guest.click('#lobby-join');

			await expect(host.locator('#lobby-seat-BEA')).toBeVisible();

			// Read off the attribute rather than the text, because the text is the skin's business — the
			// seat row sits in a direction's own face and is free to set it however it likes.
			for (const page of [host, guest]) {
				await expect(page.locator('#lobby-seat-ANA')).toHaveAttribute('data-rating', /^\d+$/);
				await expect(page.locator('#lobby-seat-BEA')).toHaveAttribute('data-rating', /^\d+$/);
			}

			// A browser that has never finished a game is on the starting rating. That is a fact about
			// them, not a missing value, so it is shown rather than left blank.
			await expect(host.locator('#lobby-seat-ANA')).toHaveAttribute('data-rating', '1000');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// The finder's own version of the same thing: what a table averages, so somebody scanning the list
	// can see what they would be walking into before they commit to it.
	test('a row in the finder carries what the table averages', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);
		const room = uniqueRoomName('rated');

		try {
			await openLobby(host, 'ANA', 'start');
			await host.fill('#lobby-room-name', room);
			await host.click('#lobby-create');
			await expect(host.locator('#lobby-room-code')).toBeVisible();

			await openLobby(guest, 'BEA', 'join');
			await guest.fill('#lobby-search', room);

			const row = guest.locator(`#lobby-rooms [data-room-name="${room}"]`);

			// Pushed rather than polled, so this is a poll on the assertion instead: the list arrives on
			// the server's own interval.
			await expect(row).toBeVisible();
			await expect(row).toHaveAttribute('data-room-rating', '1000');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// The moment the number changes is the moment it is worth showing. Reaching the end of a real game
	// through the UI would mean killing three CEOs, so this checks the other end of the same wire: that
	// the score sheet has somewhere to put it and puts nothing there before it arrives.
	test('the score sheet shows no rating movement before a game has finished', async ({ page }) => {
		// `?test=endgame` is a mid-game mock with no server behind it, so nothing was rated — which is
		// exactly the state that must render cleanly rather than showing a stray dash or a zero.
		await page.goto('/?test=endgame&hotseat');

		await expect(page.locator('#lobby-create')).toHaveCount(0);
		await expect(page.locator('[data-delta]')).toHaveCount(0);
	});
});

test.describe('AUTOMATCH', () => {
	// Serial, and this is the one place in the suite that has to be.
	//
	// Every spec talks to the same game server, and unlike a room — which is private to whoever holds its
	// code — **the queue is a single shared object**. Two of these running at once put four strangers in
	// one queue: the second spec's ANA cannot sit with the first spec's ANA (one name per table), so the
	// match that should have formed does not, while the guest is liable to be matched with somebody else's
	// host instead. It fails as "no room code", which says nothing about either.
	//
	// Unique names per spec would make it worse rather than better: the tables would then form, just with
	// the wrong people at them.
	test.describe.configure({ mode: 'serial' });

	// The test server's `HA_MATCH_HOLD_MS` is half a second rather than the real fifteen, so this is a
	// real match rather than a spec waiting on a timer — see the note in playwright.config.mjs. Which is
	// also why the two-are-waiting state is asserted *before* the second player queues: with a hold that
	// short, the table forms almost immediately after.
	test('two players who ask for a game are put in one room together', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);

		try {
			await openLobby(host, 'ANA', 'start');
			await host.click('#lobby-queue');

			// Searching, and saying so — a button that changed nothing visible would be indistinguishable
			// from one that did not work.
			await expect(host.locator('#lobby-queue-status')).toBeVisible();
			await expect(host.locator('#lobby-queue')).toContainText('CANCEL');
			await expect(host.locator('#lobby-queue-status')).toHaveAttribute('data-waiting', '1');

			await openLobby(guest, 'BEA', 'start');
			await guest.click('#lobby-queue');

			// And then they are seated. A matched table is an ordinary room: the waiting room, with both
			// names in it and a START for whoever asked first.
			await expect(host.locator('#lobby-room-code')).toBeVisible();
			await expect(host.locator('#lobby-seat-ANA')).toBeVisible();
			await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
			await expect(guest.locator('#lobby-seat-ANA')).toBeVisible();

			// One room, not two.
			expect(await guest.locator('#lobby-room-code').innerText()).toEqual(
				await host.locator('#lobby-room-code').innerText(),
			);

			// The host is the one who waited longest, and the game is theirs to start.
			await expect(host.locator('#lobby-start')).toBeVisible();
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	test('cancelling puts the lobby back', async ({ page }) => {
		await openLobby(page, 'ANA', 'start');
		await page.click('#lobby-queue');
		await expect(page.locator('#lobby-queue-status')).toBeVisible();

		await page.click('#lobby-queue');

		await expect(page.locator('#lobby-queue-status')).toHaveCount(0);
		await expect(page.locator('#lobby-queue')).toContainText('FIND ME A GAME');
	});

	// The queue needs a name for the same reason a room does — it is what the seat will be called — and
	// the button says so rather than failing silently when pressed.
	test('it asks who you are first', async ({ page }) => {
		await page.goto('/');
		await page.click('#lobby-menu-start');

		await expect(page.locator('#lobby-queue-need-name')).toBeVisible();
		await expect(page.locator('#lobby-queue')).toBeDisabled();
	});
});
