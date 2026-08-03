import { test, expect } from './fixtures';
import { DEFAULT_SKIN, SKIN_NAMES } from 'Domain/skins';

// Which direction the interface is wearing, and when it is allowed to change.
//
// Note these specs mostly navigate for themselves rather than taking the shared `page` fixture's
// pinned skin, because the thing under test *is* the pin and the draw. Where a spec does want the
// pin it says so in the URL.

const skinOf = page => page.evaluate(() => document.documentElement.dataset.skin);

// Online, changing the skin is a round trip: click, server, broadcast, re-render. Reading the
// attribute straight after a click is a race — it passes on a quiet machine and fails the moment the
// suite runs fully parallel, which is exactly how the first version of these specs behaved.
const expectSkin = (page, skin) => expect.poll(() => skinOf(page)).toBe(skin);

test.describe('the main menu', () => {
	test('is always the file room', async ({ page }) => {
		// The first screen a player ever sees is not a draw. A game starts as a form on a desk.
		await page.goto('/');
		await expect(page.locator('#start-btn')).toBeVisible();

		expect(await skinOf(page)).toBe(DEFAULT_SKIN);
	});

	test('is still the file room after the names are filled in', async ({ page }) => {
		await page.goto('/');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');

		expect(await skinOf(page)).toBe(DEFAULT_SKIN);
	});
});

test.describe('a hot-seat game', () => {
	test('draws a skin on the way in to friend & foe', async ({ page }) => {
		await page.goto('/');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		// Any of the three, dossier included — staying is a real outcome of the draw.
		expect(SKIN_NAMES).toContain(await skinOf(page));
	});

	test('keeps the drawn skin for the rest of the game', async ({ page }) => {
		await page.goto('/');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		const drawn = await skinOf(page);

		for (const _player of [1, 2]) {
			await page.click('#alingnment-card-friend');
			await page.click('#alingnment-card-foe');
			await page.click('#alignments-btn');
		}

		await page.click('#alignments-btn');
		await page.waitForSelector('#pz-0-A1');

		// The table agreed on a look once. Re-drawing it mid-game would be the interface changing
		// under the players, which is the one thing a skin must never do.
		expect(await skinOf(page)).toBe(drawn);

		// And it is still a playable board, not merely a repainted one.
		await expect(page.locator('#pz-0-A1')).toBeVisible();
	});

	test('honours a pinned skin instead of drawing', async ({ page }) => {
		await page.goto('/?skin=vault');
		expect(await skinOf(page)).toBe('vault');

		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		expect(await skinOf(page)).toBe('vault');
	});

	test('ignores a skin that does not exist', async ({ page }) => {
		// A stale link should fall back rather than leave the app with no tokens at all.
		await page.goto('/?skin=wire');

		expect(await skinOf(page)).toBe(DEFAULT_SKIN);
	});
});

test.describe('a skin actually paints the page', () => {
	// This exists because of a silent, total failure that looked like nothing at all.
	//
	// styled-components v4 preprocesses with stylis, which strips `//` as a line comment. A `http://`
	// inside a background-image data URI therefore swallowed the rest of its declaration *and* the
	// closing brace of its block — so the next skin's block and the whole `html` rule were nested
	// inside it and never applied. Every custom property still resolved, every control still looked
	// right, and the page had no ground. Nothing threw, and no existing spec noticed.
	//
	// Asserting the ground is painted is the cheapest possible guard against a CSS parse that ended
	// somewhere other than where it was written.
	for (const skin of SKIN_NAMES) {
		test(`${skin} has a ground and a body ink`, async ({ page }) => {
			await page.goto(`/?skin=${skin}`);
			await expect(page.locator('#start-btn')).toBeVisible();

			const painted = await page.evaluate(() => {
				const root = getComputedStyle(document.documentElement);

				return {
					ground: root.backgroundColor,
					wash: root.backgroundImage,
					ink: getComputedStyle(document.body).color,
				};
			});

			expect(painted.ground).not.toBe('rgba(0, 0, 0, 0)');
			expect(painted.wash).not.toBe('none');
			expect(painted.ink).not.toBe('');
		});
	}

	test('every skin block is a block of its own', async ({ page }) => {
		// The failure above showed up in the cascade as one selector swallowing another. Reading the
		// injected rules back is the only way to see that from the outside.
		await page.goto('/');
		await expect(page.locator('#start-btn')).toBeVisible();

		const selectors = await page.evaluate(() => {
			const found = [];

			for (const sheet of document.styleSheets) {
				try {
					for (const rule of sheet.cssRules) {
						found.push(rule.selectorText || '');
					}
				} catch {
					// A stylesheet from another origin. None of ours are.
				}
			}

			return found;
		});

		// No selector should mention two skins, and `html` should never be nested under one.
		const tangled = selectors.filter(
			selector => (selector.match(/data-skin/g) || []).length > 1 || /data-skin.*\bhtml\b/.test(selector),
		);

		expect(tangled).toEqual([]);
		expect(selectors).toContain('html');
	});
});

test.describe('a skin changes the chrome and nothing else', () => {
	// The reason this matters is not tidiness: every hexagon and every piece is a transparent DOM
	// element laid on the projection of its own tile, and both the drag controller and the whole
	// browser suite hit-test against those boxes. A skin that resized one would break the game.
	//
	// Measured relative to the board rather than to the viewport, and deliberately so. The whole
	// board can and does sit a pixel or two higher in one direction than another, because the turn
	// strip above it is set in that direction's own typeface and its NEXT TURN button has that
	// direction's own border on it — a hairline in Blueprint, a 2px stamp outline in Dossier. That
	// offset is harmless: the boxes are projected from the board element's own rect, so they move
	// with it exactly. What must never differ is a cell's SIZE or where it sits inside the board.
	test('leaves the board geometry alone', async ({ page }) => {
		const geometryFor = async skin => {
			await page.goto(`/?skin=${skin}`);
			await page.fill('#player-name1', 'Fede');
			await page.fill('#player-name2', 'Sara');
			await page.click('#start-btn');
			await page.waitForSelector('#alignments-btn');

			for (const _player of [1, 2]) {
				await page.click('#alingnment-card-friend');
				await page.click('#alingnment-card-foe');
				await page.click('#alignments-btn');
			}

			await page.click('#alignments-btn');
			await page.waitForSelector('#hex-3-3');

			return page.evaluate(() => {
				const board = document.querySelector('#hex-3-3').offsetParent.getBoundingClientRect();

				return ['#hex-0-0', '#hex-3-3', '#hex-6-3', '#hex--1--1', '#store-0'].map(selector => {
					const box = document.querySelector(selector).getBoundingClientRect();

					return [
						Math.round(box.x - board.x),
						Math.round(box.y - board.y),
						Math.round(box.width),
						Math.round(box.height),
					];
				});
			});
		};

		const dossier = await geometryFor('dossier');
		const vault = await geometryFor('vault');
		const blueprint = await geometryFor('blueprint');

		expect(vault).toEqual(dossier);
		expect(blueprint).toEqual(dossier);
	});

	test('keeps the feedback vocabulary a returning player owns', async ({ page, clickOn, get }) => {
		// Red means "you may go there" in every direction, and a selected piece is still
		// brightness(2). Re-tuning either per skin would make the board mean different things on
		// different evenings — and would take forty assertions in this suite with it.
		await page.goto('/?skin=blueprint');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		for (const _player of [1, 2]) {
			await page.click('#alingnment-card-friend');
			await page.click('#alingnment-card-foe');
			await page.click('#alignments-btn');
		}

		await page.click('#alignments-btn');
		await page.waitForSelector('#pz-0-A1');

		// Deploy an agent, point it, hand over the turn, then pick it up again.
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);
		await page.click('#next-turn');
		await clickOn.team(0).agent(1);

		// A red border on a cell it may move to — read as a literal computed style by helpers/get.js
		// (`2px solid rgb(255, 0, 0)`), which is why the highlight is not in the token table at all.
		// An unbuffed agent moves two cells in front of it, so the far one is lit and the near one is
		// not; asserting both ways round is what makes this a check on the colour rather than on the
		// mere presence of a border somewhere.
		expect(await get.cell(3, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(2, 2).isHighlighted).toBeFalsy();

		// The other half of the vocabulary, brightness(2) on a selected piece, is asserted forty times
		// over by the sniper and spy specs — and those now run with the skin pinned by the fixture.
	});
});

// ── Online ────────────────────────────────────────────────────────────────────────────────────
// Two contexts are two players. The point of these is that the skin is a fact about the ROOM, not
// about whoever happens to be looking at it: the host draws it, the server keeps it, and every seat
// that joins is told the same one in the same frame as the seat list.
//
// The test server pins HA_SKIN (see playwright.config.mjs), so the value here is known — what these
// specs check is that both seats arrive at it and hold it across the phases, not what it drew.
test.describe('an online room', () => {
	test('shows the host its own skin in the waiting room', async ({ page }) => {
		await page.goto('/');
		await page.click('#play-online-btn');
		await page.fill('#lobby-name', 'ANA');
		await page.click('#lobby-create');
		await expect(page.locator('#lobby-room-code')).toBeVisible();

		expect(SKIN_NAMES).toContain(await skinOf(page));
	});

	test('gives every seat the same skin, and keeps it into the game', async ({ browser }) => {
		const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const host = await hostContext.newPage();
		const guest = await guestContext.newPage();

		await host.goto('/');
		await host.click('#play-online-btn');
		await host.fill('#lobby-name', 'ANA');
		await host.click('#lobby-create');
		await expect(host.locator('#lobby-room-code')).toBeVisible();
		const code = await host.locator('#lobby-room-code').innerText();

		await guest.goto(`/#/r/${code}`);
		await guest.fill('#lobby-name', 'BEA');
		await guest.fill('#lobby-code', code);
		await guest.click('#lobby-join');
		await expect(guest.locator('#lobby-room-code')).toBeVisible();

		// Gate on the picker rather than the room code: the code arrives with the seat frame, the skin
		// with the room frame, so reading the baseline off the code alone can catch the default.
		await expect(host.locator('#skin-picker')).toBeVisible();

		// The waiting room already looks like the game will, on both screens.
		const roomSkin = await skinOf(host);

		expect(SKIN_NAMES).toContain(roomSkin);
		await expectSkin(guest, roomSkin);

		// And it survives the game starting, for both of them.
		await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
		await host.click('#lobby-start');

		await expect(host.locator('#alignments-btn')).toBeVisible();
		await expect(guest.locator('#alignments-btn')).toBeVisible();

		await expectSkin(host, roomSkin);
		await expectSkin(guest, roomSkin);

		await host.click('#alignments-btn');
		await guest.click('#alignments-btn');

		await expect(host.locator('#pz-0-A1')).toBeVisible();
		await expect(guest.locator('#pz-0-A1')).toBeVisible();

		await expectSkin(host, roomSkin);
		await expectSkin(guest, roomSkin);

		await hostContext.close();
		await guestContext.close();
	});

	test('a room ignores ?skin, because the table has to agree', async ({ browser }) => {
		// A player who pins a skin in their own URL must not end up looking at a different table from
		// everybody else. Online the pin is inert: the room's own skin wins.
		//
		// The host sets the room to a known style rather than this spec trusting the server's HA_SKIN,
		// so the expectation holds even when the suite has quietly reused a game server that was
		// started without it — which is exactly what a stray `./dev.sh` leaves behind.
		const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const host = await hostContext.newPage();
		const guest = await guestContext.newPage();

		await host.goto('/');
		await host.click('#play-online-btn');
		await host.fill('#lobby-name', 'ANA');
		await host.click('#lobby-create');
		await expect(host.locator('#lobby-room-code')).toBeVisible();
		const code = await host.locator('#lobby-room-code').innerText();

		await host.click('#skin-option-blueprint');
		await expectSkin(host, 'blueprint');

		// The guest asks for vault in their own URL, and gets the room's blueprint.
		await guest.goto(`/?skin=vault#/r/${code}`);
		await guest.fill('#lobby-name', 'BEA');
		await guest.fill('#lobby-code', code);
		await guest.click('#lobby-join');
		await expect(guest.locator('#lobby-room-code')).toBeVisible();

		await expectSkin(guest, 'blueprint');

		await hostContext.close();
		await guestContext.close();
	});
});

// ── The host may overrule the draw ────────────────────────────────────────────────────────────
// Two windows, and they are the two where nobody is reading anybody: the waiting room and the
// friend-and-foe cards. After that the board is up and the furniture stops moving.
test.describe('changing the style', () => {
	test('hot-seat: not offered on the main menu', async ({ page }) => {
		await page.goto('/');

		await expect(page.locator('#skin-picker')).toHaveCount(0);
	});

	test('hot-seat: offered at friend & foe, and it sticks into the game', async ({ page }) => {
		await page.goto('/?skin=dossier');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		await expect(page.locator('#skin-picker')).toBeVisible();
		await page.click('#skin-option-vault');
		expect(await skinOf(page)).toBe('vault');

		// Overruling the draw is a choice, not a preview: it survives into the game.
		for (const _player of [1, 2]) {
			await page.click('#alingnment-card-friend');
			await page.click('#alingnment-card-foe');
			await page.click('#alignments-btn');
		}

		await page.click('#alignments-btn');
		await page.waitForSelector('#pz-0-A1');

		expect(await skinOf(page)).toBe('vault');
	});

	test('hot-seat: gone once the game has started', async ({ page }) => {
		await page.goto('/?skin=dossier');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		for (const _player of [1, 2]) {
			await page.click('#alingnment-card-friend');
			await page.click('#alingnment-card-foe');
			await page.click('#alignments-btn');
		}

		await page.click('#alignments-btn');
		await page.waitForSelector('#pz-0-A1');

		await expect(page.locator('#skin-picker')).toHaveCount(0);
	});

	test('online: the host changes it and the whole room follows', async ({ browser }) => {
		const hostContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const guestContext = await browser.newContext({ viewport: { width: 800, height: 600 } });
		const host = await hostContext.newPage();
		const guest = await guestContext.newPage();

		await host.goto('/');
		await host.click('#play-online-btn');
		await host.fill('#lobby-name', 'ANA');
		await host.click('#lobby-create');
		await expect(host.locator('#lobby-room-code')).toBeVisible();
		const code = await host.locator('#lobby-room-code').innerText();

		await guest.goto(`/#/r/${code}`);
		await guest.fill('#lobby-name', 'BEA');
		await guest.fill('#lobby-code', code);
		await guest.click('#lobby-join');
		await expect(guest.locator('#lobby-room-code')).toBeVisible();

		// The host has the control in the waiting room; a guest does not, in the same room.
		await expect(host.locator('#skin-picker')).toBeVisible();
		await expect(guest.locator('#skin-picker')).toHaveCount(0);

		await host.click('#skin-option-blueprint');
		await expectSkin(guest, 'blueprint');
		await expectSkin(host, 'blueprint');

		// Still the host's to change while the table is looking at its cards.
		await expect(host.locator('#lobby-seat-BEA')).toBeVisible();
		await host.click('#lobby-start');
		await expect(host.locator('#alignments-btn')).toBeVisible();
		await expect(guest.locator('#alignments-btn')).toBeVisible();

		await expect(host.locator('#skin-picker')).toBeVisible();
		await expect(guest.locator('#skin-picker')).toHaveCount(0);

		await host.click('#skin-option-vault');
		await expectSkin(host, 'vault');
		await expectSkin(guest, 'vault');

		// And gone for everyone once the board is up, on both screens.
		await host.click('#alignments-btn');
		await guest.click('#alignments-btn');
		await expect(host.locator('#pz-0-A1')).toBeVisible();
		await expect(guest.locator('#pz-0-A1')).toBeVisible();

		await expect(host.locator('#skin-picker')).toHaveCount(0);
		await expect(guest.locator('#skin-picker')).toHaveCount(0);
		await expectSkin(host, 'vault');
		await expectSkin(guest, 'vault');

		await hostContext.close();
		await guestContext.close();
	});
});
