import { test, expect } from './fixtures';

// Two independent browser contexts are two independent players. This is the only way to check the
// things that matter about multiplayer from the outside: that a player cannot act on somebody
// else's turn, and cannot see their cards. The equivalent test in puppeteer would have been a
// contortion; here a context is just a second browser.

async function joinRoom(page, { code, name }) {
	// A room code in the hash still lands on the same lobby with the code already filled in — it is
	// the "join a game" door that opens on its own, not the code field.
	await page.goto(code ? `/#/r/${code}` : '/');

	await page.fill('#lobby-name', name);

	if (code) {
		await page.click('#lobby-menu-join');
		await page.fill('#lobby-code', code);
		await page.click('#lobby-join');
	} else {
		await page.click('#lobby-menu-start');
		await page.click('#lobby-create');
	}

	// A refused join leaves the lobby saying why, and waiting for the room code alone reports it as
	// "element not found" — which is how tripping the per-address join limit turns into a mystery
	// rather than a message. The cost is paid only when something has already gone wrong.
	try {
		await expect(page.locator('#lobby-room-code')).toBeVisible();
	} catch (error) {
		const refused = page.locator('#lobby-error');

		throw (await refused.count()) ? new Error(`the lobby refused it: ${await refused.innerText()}`) : error;
	}

	return page.locator('#lobby-room-code').innerText();
}

// The test server keeps its rooms in .playwright-rooms between runs, and the suite is fullyParallel,
// so the public list contains rooms from other specs and from previous runs. Anything asserting about
// the list has to search for a name that cannot collide with either.
function uniqueRoomName(prefix) {
	return `${prefix}-${Date.now()}`;
}

async function twoContexts(browser) {
	const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
	const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });

	return { hostContext, guestContext, host: await hostContext.newPage(), guest: await guestContext.newPage() };
}

// Host creates, guest joins by code, host starts, both confirm their cards.
async function twoPlayerGame(browser) {
	const { hostContext, guestContext, host, guest } = await twoContexts(browser);

	const code = await joinRoom(host, { name: 'ANA' });
	await joinRoom(guest, { code, name: 'BEA' });

	await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
	await host.click('#lobby-start');

	// Each player now sees their own two cards and nothing else.
	await expect(host.locator('#alingnment-card-friend')).toBeVisible();
	await expect(guest.locator('#alingnment-card-friend')).toBeVisible();

	return { hostContext, guestContext, host, guest, code };
}

test.describe('THE ROOM FINDER', () => {
	// The point of the whole feature: a player who was told nothing but "we're playing" can find the
	// table. Everything the row shows is asserted off data attributes rather than off its text,
	// because the text is the skin's — small caps, and free to abbreviate — while the count, the host
	// and the state are facts a player acts on.
	test('a guest finds a public room by name and joins it from the list', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);
		const room = uniqueRoomName('find-me');

		try {
			await host.goto('/');
			await host.fill('#lobby-name', 'ANA');
			await host.click('#lobby-menu-start');
			await host.fill('#lobby-room-name', room);
			await host.click('#lobby-create');

			const code = await host.locator('#lobby-room-code').innerText();

			// The waiting room says what the table is called, not only what to type to reach it.
			await expect(host.locator('#lobby-room-title')).toHaveText(room);

			await guest.goto('/');
			await guest.fill('#lobby-name', 'BEA');
			await guest.click('#lobby-menu-join');
			await guest.fill('#lobby-search', room);

			const row = guest.locator(`#lobby-room-${code}`);

			await expect(row).toBeVisible();
			await expect(row).toHaveAttribute('data-room-name', room);
			await expect(row).toHaveAttribute('data-room-host', 'ANA');
			await expect(row).toHaveAttribute('data-room-players', '1');
			await expect(row).toHaveAttribute('data-room-state', 'lobby');

			await row.click();

			// Selecting the row is joining it — the same room, from both ends.
			await expect(guest.locator('#lobby-room-code')).toHaveText(code);
			await expect(guest.locator('#lobby-room-title')).toHaveText(room);
			await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// Private is not a dimmed row or a lock icon. The room is simply not in the list, and its code
	// still works — which is the whole of what a shared link to a private table is.
	test('a private room is nowhere in the list and still joins by code', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);
		const room = uniqueRoomName('hide-me');

		try {
			await host.goto('/');
			await host.fill('#lobby-name', 'ANA');
			await host.click('#lobby-menu-start');
			await host.fill('#lobby-room-name', room);
			await host.click('#lobby-visibility-private');
			await host.click('#lobby-create');

			const code = await host.locator('#lobby-room-code').innerText();

			await expect(host.locator('#lobby-room-title')).toHaveText(room);

			await guest.goto('/');
			await guest.fill('#lobby-name', 'BEA');
			await guest.click('#lobby-menu-join');
			await guest.fill('#lobby-search', room);

			// Searched for by its exact name, and the finder says there is no such room.
			await expect(guest.locator('#lobby-rooms-empty')).toBeVisible();
			await expect(guest.locator(`#lobby-room-${code}`)).toHaveCount(0);

			await guest.fill('#lobby-code', code);
			await guest.click('#lobby-join');

			await expect(guest.locator('#lobby-room-code')).toHaveText(code);
			await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// A refresh keeps the room in the URL and needs none of this. Arriving at the front door instead —
	// a bookmark, a new tab, a laptop reopened on the plain address — loses the hash, and without the
	// offer the game you are in the middle of is invisible from the one screen that could take you
	// back to it.
	test('coming back to the front door offers the seat you are still holding', async ({ browser }) => {
		const { hostContext, guestContext, host, code } = await twoPlayerGame(browser);

		try {
			const friend = await host.locator('#alingnment-card-friend [data-team]').getAttribute('data-team');

			// No hash, so nothing in the URL says which room this browser belongs to.
			await host.goto('/');

			const resume = host.locator(`#lobby-resume-${code}`);

			await expect(resume).toBeVisible();
			await expect(resume).toContainText('ANA');

			await resume.click();

			// The same seat rather than a second one at the table: the same player is addressed, and the
			// cards dealt to them are the cards they had. A fresh seat could not exist at all — the game
			// has started — so what this rules out is the offer landing somebody in the lobby instead.
			await expect(host.locator('.game')).toContainText('ANA, these are yours');
			await expect(host.locator('#alingnment-card-friend [data-team]')).toHaveAttribute('data-team', friend);
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});
});

test.describe('YOUR NAME', () => {
	// Typing the same six letters every time is the sort of small tax that makes a game feel like a
	// form, and the lobby asks on the way into every room — after a game, after leaving one, after a
	// refresh at the front door.
	test('is remembered, and filled in next time', async ({ browser }) => {
		const context = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const page = await context.newPage();

		try {
			await page.goto('/');

			// A browser that has never played opens empty, exactly as it did.
			await expect(page.locator('#lobby-name')).toHaveValue('');

			await page.fill('#lobby-name', 'ANA');
			await page.click('#lobby-menu-start');
			await page.click('#lobby-create');
			await expect(page.locator('#lobby-room-code')).toBeVisible();

			// Out of the room and back at the index: no typing.
			await page.click('#lobby-leave');
			await expect(page.locator('#lobby-name')).toHaveValue('ANA');

			// And across a reload, which is how a returning player actually arrives.
			await page.reload();
			await expect(page.locator('#lobby-name')).toHaveValue('ANA');
			// Filled in means ready: NEW ROOM is live without a keystroke, because the room name is
			// drawn and the player's name is already there.
			await page.click('#lobby-menu-start');
			await expect(page.locator('#lobby-create')).toBeEnabled();
		} finally {
			await context.close();
		}
	});

	// Why it is written when the server confirms a seat rather than on every keystroke: what comes back
	// is a name that actually worked. A name the room refused is not the name to greet somebody with.
	test('a name the room refused is not the one remembered', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);

		try {
			await host.goto('/');
			await host.fill('#lobby-name', 'ANA');
			await host.click('#lobby-menu-start');
			await host.click('#lobby-create');

			const code = await host.locator('#lobby-room-code').innerText();

			await guest.goto(`/#/r/${code}`);
			await guest.fill('#lobby-name', 'ANA');
			await guest.click('#lobby-menu-join');
			await guest.fill('#lobby-code', code);
			await guest.click('#lobby-join');

			await expect(guest.locator('#lobby-error')).toContainText('already has that name');

			// Nothing was kept, so the next visit does not open on a name this table will refuse again.
			// A fresh visit rather than a reload: entering "Join a game" moved the hash off the shared
			// link and onto its own path, and a reload now honours that path — the front door, and the
			// name field with it, is a step back from here, not a reload of it.
			await guest.goto('/');
			await expect(guest.locator('#lobby-name')).toHaveValue('');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});
});

test.describe('MENU NAVIGATION', () => {
	// Each submenu is a real path rather than only React state, so the browser's own back button
	// works — and Escape has to do the exact same thing, not a lookalike of it.
	test('the browser’s back button returns from a submenu to the main menu', async ({ page }) => {
		await page.goto('/');
		await page.click('#lobby-menu-start');
		await expect(page.locator('#lobby-back')).toBeVisible();

		await page.goBack();

		await expect(page.locator('#lobby-name')).toBeVisible();
	});

	test('Escape does the same as the back button', async ({ page }) => {
		await page.goto('/');
		await page.click('#lobby-menu-join');
		await expect(page.locator('#lobby-back')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.locator('#lobby-name')).toBeVisible();
	});

	// A shared link or a bookmark into a submenu has no earlier page in this tab's history to fall
	// back to, so the app has to make one — or the very first press of back would leave the app
	// altogether instead of reaching the menu.
	test('a link straight into a submenu still lets the back button reach the menu', async ({ page }) => {
		await page.goto('/#/start');
		await expect(page.locator('#lobby-back')).toBeVisible();

		await page.goBack();

		await expect(page.locator('#lobby-name')).toBeVisible();
	});
});

test.describe('LEAVING', () => {
	// The seat count everybody is looking at is the thing that has to move. Leaving a waiting room is
	// the cheap case — the room stays, its code still joins it — so the button goes straight out.
	test('leaving the waiting room takes the seat off everybody’s list', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoContexts(browser);

		try {
			await host.goto('/');
			await host.fill('#lobby-name', 'ANA');
			await host.click('#lobby-menu-start');
			await host.click('#lobby-create');

			const code = await host.locator('#lobby-room-code').innerText();

			await joinRoom(guest, { code, name: 'BEA' });
			await expect(host.locator('#lobby-seats')).toContainText('BEA');
			await expect(host.locator('#lobby-room-code')).toBeVisible();

			await guest.click('#lobby-leave');

			// The guest is back at the front door, with a room to find rather than one to sit in — and the
			// room is out of the URL too, so a reload does not put them back in it.
			await expect(guest.locator('#lobby-name')).toBeVisible();
			await expect(guest.locator('#lobby-room-code')).toHaveCount(0);
			expect(new URL(guest.url()).hash).toEqual('');

			// And the host's list is one shorter.
			await expect(host.locator('#lobby-seats')).not.toContainText('BEA');
			await expect(host.locator('#lobby-seats')).toContainText('ANA');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// Leaving from the board is asked twice, because it sits among the controls a player presses all
	// game and a started room takes no new seats: there is no way back in.
	test('leaving the board asks first, and says what it costs', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();

			await host.click('#leave-game');

			// Two players, so leaving strands the other one — and the screen says the game ends rather
			// than that it carries on.
			await expect(host.locator('#leave-screen')).toBeVisible();
			await expect(host.locator('#leave-note')).toContainText('the last player leaves with you');
			// The other half of the price. This screen exists to name what leaving costs, and since it
			// started costing rating and a wait, a screen that did not say so would be misleading rather
			// than merely incomplete.
			await expect(host.locator('#leave-rating-cost')).toBeVisible();

			// Standing down puts the board back, unchanged.
			await host.click('#leave-close');
			await expect(host.locator('#leave-screen')).toHaveCount(0);
			await expect(host.locator('#next-turn')).toBeVisible();
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// The rule the whole thing turns on: a game needs two, so the last player goes too rather than
	// being left alone in a game they cannot play. And they are told why, because nothing they did
	// caused it.
	test('leaving a two-player game puts the other player out too, and says why', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(guest.locator('#next-turn')).toBeVisible();

			await host.click('#leave-game');
			await host.click('#leave-confirm');

			// Both at the index, both with the room gone from the URL — the one who asked and the one who
			// did not.
			await expect(host.locator('#lobby-name')).toBeVisible();
			await expect(guest.locator('#lobby-name')).toBeVisible();
			await expect(guest.locator('#lobby-error')).toContainText('Everybody else left');
			expect(new URL(host.url()).hash).toEqual('');
			expect(new URL(guest.url()).hash).toEqual('');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// Three players is the case where the game genuinely continues, and the leaver is on turn — which
	// is the one that could leave the table with nobody holding it.
	test('a three-player game carries on with the turn passed on', async ({ browser }) => {
		const contexts = [];
		const pages = [];

		for (const _seat of ['ANA', 'BEA', 'CARA']) {
			const context = await browser.newContext({ viewport: { width: 800, height: 600 } });

			contexts.push(context);
			pages.push(await context.newPage());
		}

		const [host, second, third] = pages;

		try {
			const code = await joinRoom(host, { name: 'ANA' });
			await joinRoom(second, { code, name: 'BEA' });
			await joinRoom(third, { code, name: 'CARA' });

			await expect(host.locator('#lobby-seats')).toContainText('CARA');
			await host.click('#lobby-start');

			for (const page of pages) {
				await expect(page.locator('#alingnment-card-friend')).toBeVisible();
				await page.click('#alignments-btn');
			}

			await expect(second.locator('#turn-player')).toHaveText('ANA');

			await host.click('#leave-game');
			await host.click('#leave-confirm');

			await expect(host.locator('#lobby-name')).toBeVisible();

			// Still playing, and somebody holds the turn — rendering a board where nobody does throws.
			await expect(second.locator('#turn-player')).toHaveText('BEA');
			await expect(third.locator('#turn-player')).toHaveText('BEA');
			await expect(second.locator('#next-turn')).toBeVisible();
		} finally {
			for (const context of contexts) {
				await context.close();
			}
		}
	});

	// The trap this closes: everybody has confirmed their cards except one player who has closed their
	// laptop, and the rest are looking at a game that will never start. The way out has to be on that
	// screen, and it goes straight out — a waiting screen is where a confirmation step would be the
	// obstacle rather than the safeguard.
	test('a player can leave while the table is still confirming its cards', async ({ browser }) => {
		const contexts = [];
		const pages = [];

		for (const _seat of ['ANA', 'BEA', 'CARA']) {
			const context = await browser.newContext({ viewport: { width: 800, height: 600 } });

			contexts.push(context);
			pages.push(await context.newPage());
		}

		const [host, second, third] = pages;

		try {
			const code = await joinRoom(host, { name: 'ANA' });
			await joinRoom(second, { code, name: 'BEA' });
			await joinRoom(third, { code, name: 'CARA' });

			await expect(host.locator('#lobby-seats')).toContainText('CARA');
			await host.click('#lobby-start');

			// Two of the three confirm, and the third leaves rather than confirming.
			await host.click('#alignments-btn');
			await second.click('#alignments-btn');
			await expect(host.locator('#alignment-ready-count')).toHaveText('2/3 ready');

			await expect(third.locator('#leave-game')).toBeVisible();
			await third.click('#leave-game');

			// No screen in the way here, and the game the other two were waiting for starts.
			await expect(third.locator('#lobby-name')).toBeVisible();
			await expect(host.locator('#next-turn')).toBeVisible();
			await expect(second.locator('#next-turn')).toBeVisible();
			await expect(host.locator('#turn-player')).toHaveText('ANA');
		} finally {
			for (const context of contexts) {
				await context.close();
			}
		}
	});

	// The hole this closes: leaving used to be a request rather than a decision, so `send` returning
	// false — no open socket — meant the button did nothing at all. And the moments somebody most wants
	// out are exactly the ones with no socket.
	//
	// This is the reachable one: the same room open in a second tab. It rejoins with the token both tabs
	// share, the server hands it the seat and closes this one with `seat reclaimed`, and this tab stands
	// down rather than fighting for it back — so its socket is shut and stays shut. LEAVE has to work
	// from there.
	test('leaving works from a tab whose seat was taken, and still lands on the index', async ({ browser }) => {
		const { hostContext, guestContext, host, guest, code } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();

			// A second tab in the same browser: same localStorage, so the same seat token.
			const second = await hostContext.newPage();

			await second.goto(`/#/r/${code}`);
			await expect(second.locator('#next-turn')).toBeVisible();

			// The first tab is told, rather than going quietly dead.
			await expect(host.locator('#connection-banner')).toContainText('another window');

			await host.click('#leave-game');
			await host.click('#leave-confirm');

			// At the index, with no room in the URL to be put back into on a reload.
			await expect(host.locator('#lobby-name')).toBeVisible();
			await expect(host.locator('#lobby-room-code')).toHaveCount(0);
			expect(new URL(host.url()).hash).toEqual('');

			// And it stays there: the socket this tab reopens for the room list carries no intent to
			// rejoin, so nothing puts it back at a table it walked away from.
			await host.waitForTimeout(1500);
			await expect(host.locator('#lobby-name')).toBeVisible();
			await expect(host.locator('#next-turn')).toHaveCount(0);
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// A hot-seat game is the tab it is in: there is no room to leave and no server to tell. The control
	// is absent rather than present and inert, the same way the skin picker is.
	test('there is nothing to leave in a hot-seat game', async ({ page, goToPlay }) => {
		await goToPlay(2);

		await expect(page.locator('#leave-game')).toHaveCount(0);
		await expect(page.locator('#friend-foe')).toBeVisible();
	});
});

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

				// The team block, not the whole card: a card reads "Friend" over "WHITE" now.
				const friend = (await page.locator('#alingnment-card-friend [data-team]').innerText()).trim();
				const foe = (await page.locator('#alingnment-card-foe [data-team]').innerText()).trim();

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

	// The server specs prove a seat is reclaimable by token. This is the half a player sees: hit
	// reload mid-game and you are still in your room, still holding your own cards.
	test('a refresh puts a player back in the same seat', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();

			// A full placement: pick the piece, put it down, then point it. A piece that has been
			// placed but not pointed is mid-move, and nothing else may happen until it is.
			await host.click('#pz-0-A1');
			await host.click('#hex-1-1');
			await host.click('#hex-2-2');
			await expect(host.locator('#hex-1-1 > *')).toHaveId('pz-0-A1');

			await host.reload();

			// Back on the board rather than at the lobby, with the piece still where it was.
			await expect(host.locator('#next-turn')).toBeVisible();
			await expect(host.locator('#hex-1-1 > *')).toHaveId('pz-0-A1');
			await expect(host.locator('#turn-player')).toHaveText('ANA');

			// The same seat rather than a new one: passing the turn is something only the seat on
			// turn can do, and the effect has to reach the other player.
			await host.click('#next-turn');
			await expect(host.locator('#turn-player')).toHaveText('BEA');
			await expect(guest.locator('#turn-player')).toHaveText('BEA');
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// The mechanism behind the spec above, pinned separately because breaking it is silent. Building
	// the socket store during render meant React could build two — a useMemo factory is a cache and may
	// run more than once — and only close one. The orphan reconnected, the server gave it the seat and
	// displaced its twin, the twin took it back, and they traded it every half second. The board came
	// back from a refresh looking perfect, and every move made afterwards was written to whichever
	// socket had just lost the seat: predicted locally, so the player saw it, and never sent.
	test('a reload leaves exactly one socket holding the seat', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();

			const sockets = [];

			host.on('websocket', ws => {
				if (!ws.url().endsWith('/ws')) {
					return;
				}

				const entry = { closed: false };

				sockets.push(entry);
				ws.on('close', () => {
					entry.closed = true;
				});
			});

			await host.reload();
			await expect(host.locator('#next-turn')).toBeVisible();
			await host.waitForTimeout(1200);

			// One live socket. A second may have been opened and stood down — the store React discarded
			// is closed properly now — but exactly one is holding the seat.
			expect(sockets.filter(entry => !entry.closed)).toHaveLength(1);

			// And nothing is churning: the count is what it is, and stays there.
			const opened = sockets.length;

			await host.waitForTimeout(900);

			expect(sockets.length).toEqual(opened);
		} finally {
			await hostContext.close();
			await guestContext.close();
		}
	});

	// Every other button on this screen belongs to the player on turn. This one is the inverse: it
	// is how the rest of the table answers the move that was just made, so offering it to the mover
	// would be offering them a shot at their own piece.
	test('the SNIPE! button belongs to the players who are not on turn', async ({ browser }) => {
		const { hostContext, guestContext, host, guest } = await twoPlayerGame(browser);

		try {
			await host.click('#alignments-btn');
			await guest.click('#alignments-btn');
			await expect(host.locator('#next-turn')).toBeVisible();
			await expect(guest.locator('#next-turn')).toBeVisible();

			// An inactive Button is still in the DOM and still clickable — what says so is the
			// cursor, so that is what the assertion reads.
			const cursorOn = page => page.locator('#snipe').evaluate(node => getComputedStyle(node).cursor);

			// ANA (host) is on turn.
			expect(await cursorOn(host)).toEqual('not-allowed');
			expect(await cursorOn(guest)).toEqual('pointer');

			// A full turn, then it changes hands with the turn.
			await host.click('#pz-0-A1');
			await host.click('#hex-1-1');
			await host.click('#hex-2-2');
			await host.click('#next-turn');
			await expect(guest.locator('#turn-player')).toHaveText('BEA');

			expect(await cursorOn(host)).toEqual('pointer');
			expect(await cursorOn(guest)).toEqual('not-allowed');
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
