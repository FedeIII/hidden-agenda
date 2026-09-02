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
	// The first screen a player ever sees is not a draw, and that is true of both of them: the lobby
	// the index opens on, and the hot-seat form behind `?hotseat`. A game becomes a table later, and
	// that is where it gets a look of its own.
	test('is always the file room, and the index is the lobby', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#lobby-name')).toBeVisible();

		expect(await skinOf(page)).toBe(DEFAULT_SKIN);
	});

	test('offers the one-tab table, and that is the file room too', async ({ page }) => {
		await page.goto('/');
		await page.click('#play-hotseat-btn');
		await expect(page.locator('#start-btn')).toBeVisible();

		expect(await skinOf(page)).toBe(DEFAULT_SKIN);

		// And the way back, so neither is a dead end.
		await page.click('#play-online-btn');
		await expect(page.locator('#lobby-name')).toBeVisible();
	});

	test('is still the file room after the names are filled in', async ({ page }) => {
		await page.goto('/?hotseat');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');

		expect(await skinOf(page)).toBe(DEFAULT_SKIN);
	});
});

test.describe('a hot-seat game', () => {
	test('draws a skin on the way in to friend & foe', async ({ page }) => {
		await page.goto('/?hotseat');
		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		// Any of the three, dossier included — staying is a real outcome of the draw.
		expect(SKIN_NAMES).toContain(await skinOf(page));
	});

	test('keeps the drawn skin for the rest of the game', async ({ page }) => {
		await page.goto('/?hotseat');
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
		await page.goto('/?skin=vault&hotseat');
		expect(await skinOf(page)).toBe('vault');

		await page.fill('#player-name1', 'Fede');
		await page.fill('#player-name2', 'Sara');
		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		expect(await skinOf(page)).toBe('vault');
	});

	test('ignores a skin that does not exist', async ({ page }) => {
		// A stale link should fall back rather than leave the app with no tokens at all.
		await page.goto('/?skin=wire&hotseat');

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
			await page.goto(`/?skin=${skin}&hotseat`);
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

	// The ground is four declarations saying one thing — the layers, and the size, position and repeat
	// of each — and CSS cycles a short list instead of complaining. Drop one entry and the desk's
	// telephone silently takes the memo's corner, at the memo's size, tiled. It looks like a design
	// decision, which is the whole reason to count them from the outside.
	//
	// Splitting on top-level commas only, because every one of these values is full of commas that are
	// not separators: `url("data:...,%3Csvg")`, `rgba(255, 250, 235, 0.5)`, and the stops of every
	// gradient in the file.
	const layerCount = value => {
		let depth = 0;
		let quote = null;
		let layers = 1;

		for (const character of value) {
			if (quote) {
				if (character === quote) {
					quote = null;
				}
			} else if (character === '"' || character === "'") {
				quote = character;
			} else if (character === '(') {
				depth += 1;
			} else if (character === ')') {
				depth -= 1;
			} else if (character === ',' && depth === 0) {
				layers += 1;
			}
		}

		return layers;
	};

	for (const skin of SKIN_NAMES) {
		test(`${skin} sizes and places every layer of its ground`, async ({ page }) => {
			await page.goto(`/?skin=${skin}&hotseat`);
			await expect(page.locator('#start-btn')).toBeVisible();

			const ground = await page.evaluate(() => {
				const root = getComputedStyle(document.documentElement);

				return {
					image: root.backgroundImage,
					size: root.backgroundSize,
					position: root.backgroundPosition,
					repeat: root.backgroundRepeat,
				};
			});

			const layers = layerCount(ground.image);

			// More than one, or this direction has no ground to get wrong.
			expect(layers).toBeGreaterThan(1);
			expect(layerCount(ground.size), 'sizes').toBe(layers);
			expect(layerCount(ground.position), 'positions').toBe(layers);
			expect(layerCount(ground.repeat), 'repeats').toBe(layers);
		});
	}

	test('every skin block is a block of its own', async ({ page }) => {
		// The failure above showed up in the cascade as one selector swallowing another. Reading the
		// injected rules back is the only way to see that from the outside.
		await page.goto('/?hotseat');
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

	// The word on an alignment card, said the way each direction's own material would say it: typed on
	// the flimsy and ruled underneath, reversed out of a filled figure tab, or set on an enamelled tag.
	//
	// It gets a spec because of *how* the tokens behind it fail. The chip is the alignment's own colour
	// mixed by a per-skin percentage, and that colour has to arrive from the component rather than from
	// a token: a var() inside a custom property resolves where the property is DECLARED, so one written
	// on :root would look for the card's alignment there, find nothing, and drop the whole declaration.
	// The word would still be a word, in the wrong material, and nothing would throw.
	//
	// Read as relationships rather than as literal colours on purpose. color-mix() computes to
	// `color(srgb …)` where a plain var() computes to `rgb(…)`, so pinning either spelling would be
	// asserting Chrome's serialiser.
	test('says friend and foe in each direction’s own material', async ({ page }) => {
		const alphaOf = value => {
			const numbers = value.match(/[\d.]+/g) || [];

			return numbers.length === 4 ? Number(numbers[3]) : 1;
		};

		const labelsFor = async skin => {
			await page.goto(`/?skin=${skin}&hotseat`);
			await page.fill('#player-name1', 'Fede');
			await page.fill('#player-name2', 'Sara');
			await page.click('#start-btn');
			await page.waitForSelector('#alingnment-card-friend');

			// The cards are dealt face down: the team, and with it the block and the swatch, arrives on
			// the click. The word and the footnote are on the card either way.
			await page.click('#alingnment-card-friend');
			await page.click('#alingnment-card-foe');
			await expect(page.locator('#alingnment-card-foe [data-team]')).toBeVisible();

			return page.evaluate(() =>
				['friend', 'foe'].map(alignment => {
					const card = document.querySelector(`#alingnment-card-${alignment}`);
					const label = card.querySelector('i');
					const style = getComputedStyle(label);
					const block = card.querySelector('[data-team]');
					const team = getComputedStyle(block);
					// The swatch under the block: its chip, then its caption.
					const swatch = block.nextElementSibling;

					return {
						word: label.textContent,
						fill: style.backgroundColor,
						ink: style.color,
						rule: style.borderBottomColor,
						ruleWidth: style.borderBottomWidth,
						radius: style.borderBottomLeftRadius,
						figure: getComputedStyle(label, '::before').content,
						// The rest of the composition the study set out: the team over the width of the
						// card, the colour called out as a material under it, and what the alignment does
						// to your score along the bottom.
						teamFill: team.backgroundColor,
						teamSide: team.borderLeftColor,
						chipRadius: getComputedStyle(swatch.firstElementChild).borderTopLeftRadius,
						caption: getComputedStyle(swatch.lastElementChild, '::before').content,
						note: card.lastElementChild.textContent,
					};
				}),
			);
		};

		const [dossier, dossierFoe] = await labelsFor('dossier');
		const [blueprint, blueprintFoe] = await labelsFor('blueprint');
		const [vault, vaultFoe] = await labelsFor('vault');
		const all = [dossier, dossierFoe, blueprint, blueprintFoe, vault, vaultFoe];

		// Whatever it is wearing, it is still the word — the entire point of the cards saying it.
		expect(all.map(label => label.word)).toEqual(['Friend', 'Foe', 'Friend', 'Foe', 'Friend', 'Foe']);

		// Typed on the stock, with a rule under it. No chip: a typewriter cannot reverse type out of a
		// colour, so the ink is mixed out of the alignment instead — and green ink is not red ink.
		expect(alphaOf(dossier.fill)).toBe(0);
		expect(alphaOf(dossier.rule)).toBeGreaterThan(0);
		expect(dossier.ink).not.toEqual(dossierFoe.ink);

		// Reversed out of the alignment's own colour, undimmed by the sheet the card is printed on, and
		// numbered — a drawing numbers its figures, and the two cards are not the same figure.
		expect(alphaOf(blueprint.fill)).toBe(1);
		expect(alphaOf(blueprint.rule)).toBe(0);
		expect(blueprint.figure).toContain('FIG. 1');
		expect(blueprintFoe.figure).toContain('FIG. 2');

		// The same fill on a small enamelled tag: rounded, bevelled, and unnumbered.
		expect(alphaOf(vault.fill)).toBe(1);
		expect(vault.fill).toEqual(blueprint.fill);
		expect(vault.radius).not.toBe('0px');
		expect(vault.figure).toBe('""');
		expect(dossier.figure).toBe('""');

		// Three directions, three inks, and in none of them is the word the colour of what is behind
		// it — which is what a dropped declaration would leave.
		expect(new Set([dossier.ink, blueprint.ink, vault.ink]).size).toBe(3);
		all.forEach(label => expect(label.ink).not.toEqual(label.fill));

		// A colour, never a width. The rule is Dossier's underline and the other two set it
		// transparent, so the word occupies the same box in all three.
		expect(new Set(all.map(label => label.ruleWidth)).size).toBe(1);

		// And what the alignment does to your score, on every card in every direction. This is the one
		// fact on the card that nobody can infer from green and red.
		expect(dossier.note).toBe('their points are yours');
		expect(dossierFoe.note).toBe('their points come off yours');
		expect(new Set(all.map(card => card.note)).size).toBe(2);

		// The team runs the width of the card, ruled above and below rather than boxed — so the sides
		// are transparent in two of the three, and only the case bezels it all the way round.
		expect(alphaOf(dossier.teamSide)).toBe(0);
		expect(alphaOf(blueprint.teamSide)).toBe(0);
		expect(alphaOf(vault.teamSide)).toBeGreaterThan(0);

		// A drawing cannot print a colour: Blueprint names the team and calls the colour out separately,
		// which is why its block is the one with no fill at all.
		expect(alphaOf(blueprint.teamFill)).toBe(0);
		expect(alphaOf(dossier.teamFill)).toBe(1);
		expect(alphaOf(vault.teamFill)).toBe(1);

		// The colour itself, captioned the way each direction would caption a material — and round only
		// where it is an indicator lamp rather than a chip.
		expect(dossier.caption).toContain('colour of record');
		expect(blueprint.caption).toContain('colour ref');
		expect(vault.caption).toContain('anodised');
		expect(vault.chipRadius).not.toBe('0px');
		expect(dossier.chipRadius).toBe('0px');
	});
});

// Two players in, cards dealt, board up. The specs below need a real board rather than a mock,
// because what they are reading is where the renderer put things.
async function toBoard(page, query) {
	await page.goto(`/${query}&hotseat`);
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
}

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
			await page.goto(`/?skin=${skin}&hotseat`);
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
		await page.goto('/?skin=blueprint&hotseat');
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

	// The board is a section of the page: a rule around it, and a recess inside it darker than the
	// ground. The rule is a border, which is safe — it paints its own hairline and nothing else. The
	// FILL is the interesting half, because the canvas sits under `.game`: a background on this element
	// would be a filter over every tile the renderer drew rather than a surface under them. So the
	// recess is painted by the renderer in 3D and by CSS only on the flat path, and this asserts both
	// halves of that — including, in 3D, that nothing is painted here at all.
	test('seats the board in a recess without painting over the renderer', async ({ page }) => {
		const boardFor = async query => {
			await toBoard(page, query);

			// #board rather than a hexagon's offsetParent: flat, a hexagon is positioned against its own
			// row, and it is only in 3D that the rows stop being positioned ancestors.
			return page.evaluate(() => {
				const style = getComputedStyle(document.querySelector('#board'));

				return { frame: style.borderTopColor, width: style.borderTopWidth, fill: style.backgroundColor };
			});
		};

		const dossier = await boardFor('?skin=dossier');
		const blueprint = await boardFor('?skin=blueprint');
		const vault = await boardFor('?skin=vault');
		const flat = await boardFor('?skin=dossier&flat');

		// One hairline, three colours: the rule that divides this section from the strip above it is the
		// direction's own, and a width that varied would move every tile the boxes are projected from.
		expect(new Set([dossier.width, blueprint.width, vault.width, flat.width])).toEqual(new Set(['1px']));
		expect(new Set([dossier.frame, blueprint.frame, vault.frame]).size).toBe(3);

		// Nothing over the canvas. The renderer clears this element's own rectangle with the recess
		// instead — see SKIN_PLINTH.well in theme/tokens.js.
		expect(dossier.fill).toBe('rgba(0, 0, 0, 0)');
		expect(blueprint.fill).toBe('rgba(0, 0, 0, 0)');
		expect(vault.fill).toBe('rgba(0, 0, 0, 0)');

		// And with the renderer off there is no canvas to be in front of, so the same recess arrives as
		// an ordinary background.
		expect(flat.fill).not.toBe('rgba(0, 0, 0, 0)');
	});

	// Who holds a team, in each direction's own words — including the state that used to be nothing on
	// screen at all: nobody. `#hq-control-{team}` is the line and its words are ::before content, which
	// is where a direction's vocabulary lives and what textContent cannot see; `#claim-{team}` is the
	// control beside it, which the card offers only while there is something to claim.
	test('says who holds each team the way its own direction would', async ({ page }) => {
		const noteFor = async skin => {
			await toBoard(page, `?skin=${skin}`);

			const read = () =>
				page.evaluate(() => {
					const line = document.querySelector('#hq-control-0');
					const claim = document.querySelector('#claim-0');

					return {
						words: getComputedStyle(line, '::before').content,
						// The rule the line hangs under is on the row, which is the line's own parent.
						rule: getComputedStyle(line.parentElement).borderTopStyle,
						name: line.textContent,
						holders: document.querySelectorAll('#controlled-0').length,
						offer: claim && { label: claim.textContent, disabled: claim.disabled },
					};
				});

			const open = await read();

			// Claiming is not enough: control becomes real when the CEO is on the board.
			await page.click('#claim-0');
			await page.click('#hex-3-3');
			await page.click('#hex-3-3');
			await expect(page.locator('#controlled-0')).toHaveText('FEDE');

			return { open, claimed: await read() };
		};

		const dossier = await noteFor('dossier');
		const blueprint = await noteFor('blueprint');
		const vault = await noteFor('vault');
		const all = [dossier, blueprint, vault];

		// A file logs control, a drawing has it signed off, a case has it claimed. Three vocabularies for
		// one fact, and the name is the same DOM text under all of them.
		expect(dossier.claimed.words).toContain('CONTROL');
		expect(blueprint.claimed.words).toContain('SIGNED OFF');
		expect(vault.claimed.words).toContain('CLAIMED');
		expect(all.map(skin => skin.claimed.name)).toEqual(['FEDE', 'FEDE', 'FEDE']);

		// Unclaimed, every direction says so — under a rule the drawing draws dashed — and every one of
		// them offers the claim beside it.
		expect(dossier.open.words).toContain('UNCLAIMED');
		expect(blueprint.open.words).toContain('UNASSIGNED');
		expect(vault.open.words).toContain('UNCLAIMED');
		expect(blueprint.open.rule).toBe('dashed');
		expect(all.map(skin => skin.open.offer)).toEqual([
			{ label: 'CLAIM', disabled: false },
			{ label: 'CLAIM', disabled: false },
			{ label: 'CLAIM', disabled: false },
		]);

		// And in none of them does an unclaimed team name anybody: the holder is a child of the line and
		// exists only when there is one.
		expect(all.map(skin => skin.open.name)).toEqual(['', '', '']);
		expect(all.map(skin => skin.open.holders)).toEqual([0, 0, 0]);

		// Once the CEO is out there is nothing left to claim, so the offer is gone rather than dimmed and
		// the line is purely a statement.
		expect(all.map(skin => skin.claimed.offer)).toEqual([null, null, null]);
	});

	// The piece in hand, named on the board in each direction's own material: a typed slip clipped to
	// the subject, a part called out on a leader line, an engraved plate screwed beside the item.
	//
	// This is the mark that used to be Blueprint's alone, and the two tokens behind it are why it is a
	// spec rather than a look. The grid — the coordinates and the dimension line — stays the drawing's
	// idea, so it hangs off `--ha-mark-grid-display` while the label hangs off
	// `--ha-mark-callout-display`. One token for both would mean a file room with a scale on it, which
	// is the thing the tokens exist to prevent.
	test('names the piece in hand the way its own direction would', async ({ page, clickOn }) => {
		const markFor = async skin => {
			await toBoard(page, `?skin=${skin}`);

			// Out of the tray and onto the board, where it stays selected — which is when a direction
			// has something to say about it.
			await clickOn.team(0).agent(1);
			await clickOn.cell(3, 3);
			await expect(page.locator('#board b')).toBeVisible();

			return page.evaluate(() => {
				// Everything is read off the label's own parent rather than off `#board`: a fallen
				// sniper's mark carries an `i` too, and this spec is not about that one.
				const label = document.querySelector('#board b');
				const callout = label.parentElement;
				const badge = callout.querySelector('i');
				const marks = document.querySelector('#board > [aria-hidden="true"]');
				// A coordinate tick. It is the first mark in the layer carrying an inline style, because
				// the dimension line above it is placed by the stylesheet and every tick is placed from
				// the projection the renderer handed back.
				const tick = marks.querySelector('span[style]');
				const tag = getComputedStyle(label);

				return {
					// The id and the piece's name, which is the fact underneath all three materials.
					text: label.textContent,
					// The word each direction puts in front of it, drawn by `content` — invisible to
					// textContent, which is exactly why it is read this way.
					key: getComputedStyle(label, '::before').content,
					// A slip and a plate are objects and paint their own ground; a drawing merely breaks
					// its own ground under the label. Read as a pair, because Vault's plate is a gradient
					// and a gradient computes as an image with a transparent colour behind it.
					tagFill: tag.backgroundColor,
					tagImage: tag.backgroundImage,
					tagEdge: tag.borderTopColor,
					tagWidth: tag.borderTopWidth,
					// Round on the drawing, square on the typed slip, bevelled on the case.
					badgeRadius: getComputedStyle(badge).borderTopLeftRadius,
					// And the leader itself: a drawn line, a typed leader of dots, a brass rod.
					lead: getComputedStyle(callout, '::before').borderTopStyle,
					// Only the drawing rules a grid on the board it is drawing.
					ticks: !!tick,
					gridShown: getComputedStyle(tick).display,
				};
			});
		};

		const dossier = await markFor('dossier');
		const blueprint = await markFor('blueprint');
		const vault = await markFor('vault');
		const all = [dossier, blueprint, vault];

		// One fact, three materials. The id and the piece's name are the same DOM text in all three —
		// `TYPE_NAMES` is lettering on the mark, so it stays English the way FIG. 1 does.
		expect(all.map(mark => mark.text)).toEqual([
			'0-A1 · AGENT, TEAM 0',
			'0-A1 · AGENT, TEAM 0',
			'0-A1 · AGENT, TEAM 0',
		]);

		// A file has subjects and a case has items. A drawing has already numbered its figures on the
		// cards and does not label a label.
		expect(dossier.key).toContain('SUBJECT');
		expect(vault.key).toContain('ITEM');
		expect(blueprint.key).toBe('""');

		// The slip is typed on paper and the plate is milled out of metal, so both are opaque objects
		// laid on the board; the drawing only interrupts its own ground under the words.
		expect(dossier.tagFill).not.toBe('rgba(0, 0, 0, 0)');
		expect(vault.tagImage).toContain('gradient');
		expect(blueprint.tagImage).toBe('none');

		// A colour, never a width — the same rule the rest of the table follows, even here where this
		// element floats over the board and could not move a hexagon if it tried.
		expect(new Set(all.map(mark => mark.tagWidth)).size).toBe(1);
		expect(new Set(all.map(mark => mark.tagEdge)).size).toBe(3);

		// A typewriter's leader is a row of dots; the other two draw a line.
		expect(dossier.lead).toBe('dotted');
		expect(blueprint.lead).toBe('solid');
		expect(vault.lead).toBe('solid');

		// The number rides a disc on the drawing and a square tag on the typed slip.
		expect(blueprint.badgeRadius).toBe('50%');
		expect(dossier.badgeRadius).toBe('0px');

		// And the grid stays the drawing's: the coordinates are in the DOM in all three directions,
		// because the marks layer is one component, and only one direction shows them.
		expect(all.map(mark => mark.ticks)).toEqual([true, true, true]);
		expect(all.map(mark => mark.gridShown)).toEqual(['none', 'block', 'none']);
	});

	// Whose turn it is, in each direction's own words. Unlike the claim line above, this one is a real
	// text node rather than ::before content — see `TURN_KEY` in turnStrip.jsx — so it is read with
	// textContent, which `text-transform: uppercase` on the key leaves alone.
	test('says whose turn it is the way its own direction would', async ({ page }) => {
		const turnFor = async skin => {
			await toBoard(page, `?skin=${skin}`);

			return page.evaluate(() => ({
				key: document.querySelector('#turn-key').textContent,
				name: document.querySelector('#turn-player').textContent,
			}));
		};

		const dossier = await turnFor('dossier');
		const blueprint = await turnFor('blueprint');
		const vault = await turnFor('vault');

		// A routing slip sends a file to a desk, a title block names who drew the sheet, and a case is
		// open in front of one person at a time.
		expect(dossier.key).toBe('on the desk of');
		expect(blueprint.key).toBe('drawn by');
		expect(vault.key).toBe('case open for');

		// Three ways of saying it, one fact underneath — and the name is the same DOM text in all three,
		// because that is what every other spec in this suite reads after a NEXT TURN.
		expect([dossier, blueprint, vault].map(turn => turn.name)).toEqual(['FEDE', 'FEDE', 'FEDE']);
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
		await page.fill('#lobby-name', 'ANA');
		await page.click('#lobby-menu-start');
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
		await host.fill('#lobby-name', 'ANA');
		await host.click('#lobby-menu-start');
		await host.click('#lobby-create');
		await expect(host.locator('#lobby-room-code')).toBeVisible();
		const code = await host.locator('#lobby-room-code').innerText();

		await host.click('#skin-option-blueprint');
		await expectSkin(host, 'blueprint');

		// The guest asks for vault in their own URL, and gets the room's blueprint.
		await guest.goto(`/?skin=vault#/r/${code}`);
		await guest.fill('#lobby-name', 'BEA');
		await guest.click('#lobby-menu-join');
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
		await page.goto('/?hotseat');

		await expect(page.locator('#skin-picker')).toHaveCount(0);
	});

	test('hot-seat: offered at friend & foe, and it sticks into the game', async ({ page }) => {
		await page.goto('/?skin=dossier&hotseat');
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
		await page.goto('/?skin=dossier&hotseat');
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
