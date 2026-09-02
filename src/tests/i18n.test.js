import { test, expect } from './fixtures';

// The language, from the outside: what a visitor sees, what the selector does to it, and what
// survives a reload.
//
// The catalogs themselves are checked without a browser — `unit/i18n.test.js` holds the two
// languages to the same shape in about a second. What needs a real page is the wiring: that the
// picker is where a player can find it, that pressing it re-renders the whole screen rather than the
// half of it that happens to re-render anyway, that `<html lang>` follows, that the choice is
// remembered, and that the skins' own words are translated too — those live in CSS `content`, which
// is the one place a missing string cannot be seen by reading the markup.

// The front door, not `?hotseat`: the picker lives under the lobby's title, and the shared fixture
// lands every other spec inside a one-tab game.
const lobby = (page, query = '') => page.goto(`/${query}`);

const langOf = page => page.evaluate(() => document.documentElement.lang);

// What a pseudo-element says. The claim line on an HQ card and the strip's section flag are drawn by
// `content: var(--ha-claim-empty)`, so there is no node to read — and a token that lost its
// translation would look exactly like a skin that chose to say nothing.
const contentOf = (page, selector, pseudo) =>
	page.evaluate(([css, which]) => getComputedStyle(document.querySelector(css), which).content, [selector, pseudo]);

test.describe('THE LANGUAGE OF THE FILE', () => {
	test('the front door is in English and offers a way out of it', async ({ page }) => {
		await lobby(page);

		await expect(page.locator('#lobby-menu-start')).toHaveText('START A GAME');
		await expect(page.locator('#language-picker')).toBeVisible();
		// Both codes are always on offer — this is a form with two boxes, not a toggle that hides
		// the state it is in.
		await expect(page.locator('#language-option-en')).toBeVisible();
		await expect(page.locator('#language-option-es')).toBeVisible();
		await expect(page.locator('#language-option-en')).toHaveAttribute('aria-pressed', 'true');
		await expect(page.locator('#language-option-es')).toHaveAttribute('aria-pressed', 'false');
		expect(await langOf(page)).toBe('en');
	});

	test('ticking ES turns the whole screen over, including the box that was ticked', async ({ page }) => {
		await lobby(page);
		await page.click('#language-option-es');

		await expect(page.locator('#lobby-menu-start')).toHaveText('CREAR PARTIDA');
		await expect(page.locator('#lobby-menu-join')).toHaveText('ENTRAR EN UNA PARTIDA');
		await expect(page.locator('#play-hotseat-btn')).toHaveText('JUGAR EN UNA SOLA PANTALLA');
		// The picker is one of the things that has to re-render: its own key is a translated word.
		await expect(page.locator('#language-picker')).toContainText('Idioma');
		await expect(page.locator('#language-option-es')).toHaveAttribute('aria-pressed', 'true');
		expect(await langOf(page)).toBe('es');

		// And back, which is not the same code path: `setLang` refuses a no-op, so a picker that only
		// worked in one direction would pass the assertion above.
		await page.click('#language-option-en');
		await expect(page.locator('#lobby-menu-start')).toHaveText('START A GAME');
		expect(await langOf(page)).toBe('en');
	});

	test('the choice survives a reload', async ({ page }) => {
		await lobby(page);
		await page.click('#language-option-es');
		await expect(page.locator('#lobby-menu-start')).toHaveText('CREAR PARTIDA');

		await lobby(page);

		await expect(page.locator('#lobby-menu-start')).toHaveText('CREAR PARTIDA');
		expect(await langOf(page)).toBe('es');
	});

	test('?lang= wins for one page load and remembers nothing', async ({ page }) => {
		// The contract `?skin=` has: a shared link may dress the page it opens, and may not quietly
		// rewrite the preference of whoever opened it.
		await lobby(page, '?lang=es');
		await expect(page.locator('#lobby-menu-start')).toHaveText('CREAR PARTIDA');

		await lobby(page);
		await expect(page.locator('#lobby-menu-start')).toHaveText('START A GAME');
	});

	test('a language nobody speaks here falls back to English', async ({ page }) => {
		await lobby(page, '?lang=fr');

		await expect(page.locator('#lobby-menu-start')).toHaveText('START A GAME');
		expect(await langOf(page)).toBe('en');
	});
});

test.describe('THE BOOK AND THE COURSE IN SPANISH', () => {
	test('the rule book turns over, and a slug still opens the same page', async ({ page }) => {
		await lobby(page, '?lang=es');
		await page.click('#lobby-menu-rules');

		await expect(page.locator('#rules-open-cheat-sheet')).toContainText('Hoja de resumen');
		await expect(page.locator('#rules-open-training')).toContainText('Aprende jugando');

		// The slug is not translated — it is in the URL, and a shared link has to open the same page
		// for everybody. So the id is the English one and the words on the card are Spanish.
		await page.click('#rules-open-the-spy');
		await expect(page.locator('#rules-next-bottom')).toContainText('El francotirador');
		await expect(page.locator('#rules-prev-bottom')).toContainText('El CEO');
		expect(page.url()).toContain('#/rules/the-spy');
	});

	test('the language can be changed from inside the book, on the page being read', async ({ page }) => {
		await lobby(page);
		await page.click('#lobby-menu-rules');
		await page.click('#rules-open-the-agent');

		await expect(page.locator('#rules-next-bottom')).toContainText('The CEO');

		// The picker sits under the lobby's title, which is above every one of its screens — so a
		// reader four pages in does not have to walk back out to switch.
		await page.click('#language-option-es');

		await expect(page.locator('#rules-next-bottom')).toContainText('El CEO');
		expect(page.url()).toContain('#/rules/the-agent');
	});

	test('an exercise is stamped in Spanish and still plays', async ({ page }) => {
		await lobby(page, '?lang=es');
		await page.click('#lobby-menu-rules');
		await page.click('#rules-open-training');

		await expect(page.locator('#training-title')).toContainText('Amigo y enemigo');
		await expect(page.locator('#training-verb')).toHaveText('MIRAR');

		// The gate is the English course's gate — a translation only replaces words — so the same two
		// clicks finish the same exercise.
		await page.click('#training-card-friend');
		await page.click('#training-card-foe');

		await expect(page.locator('#training-finding')).toBeVisible();
		await expect(page.locator('#training-finding-line')).toHaveText('Dos cartas. Nadie más las ve.');
	});
});

test.describe('THE BOARD IN SPANISH', () => {
	test('a hot-seat game plays in Spanish from the name form to the score sheet', async ({ page, goToPlay }) => {
		await page.goto('/?skin=dossier&hotseat&lang=es');

		await expect(page.locator('.game')).toContainText('NÚMERO DE JUGADORES');
		await expect(page.locator('#start-btn')).toHaveText('REPARTIR CARTAS');

		await goToPlay(2);

		await expect(page.locator('#next-turn')).toHaveText('PASAR TURNO');
		await expect(page.locator('#snipe')).toHaveText('¡DISPARO!');
		await expect(page.locator('#claim-0')).toHaveText('RECLAMAR');
		// The team names are the one bit of board vocabulary a player reads all game.
		await expect(page.locator('#hq-label-0')).toContainText('NEGRO');
		await expect(page.locator('#hq-label-3')).toContainText('AMARILLO');
	});

	test("the skin's own words are translated too, and they live in CSS", async ({ page, goToPlay }) => {
		await page.goto('/?skin=dossier&hotseat&lang=es');
		await goToPlay(2);

		// Dossier stamps CONTROL: on the file whether or not anybody has claimed the team. The words
		// are a token because which words they are is the skin's business — see theme/tokens.js — so
		// this is the one string on the board with no node of its own to read.
		expect(await contentOf(page, '#hq-control-0', '::before')).toContain('SIN RECLAMAR');
	});

	test("a skin's words are translated even where they do have a node", async ({ page, goToPlay }) => {
		// Whose turn it is is the other kind of skin wording: three catalog keys and one map, because
		// the line has a node of its own — see `TURN_KEY` in turnStrip.jsx. The case says it its own
		// way in Spanish too, and nothing about that is in CSS.
		await page.goto('/?skin=vault&hotseat&lang=es');
		await goToPlay(2);

		await expect(page.locator('#turn-key')).toHaveText('maletín abierto para');
		await expect(page.locator('#turn-player')).toHaveText('FEDE');
	});

	test('the friend and foe cards, and the ledger behind them', async ({ page, goToPlay }) => {
		await page.goto('/?skin=dossier&hotseat&lang=es');
		await goToPlay(2);

		await page.click('#friend-foe');

		await expect(page.locator('#friend-foe-eyes')).toContainText('solo para los ojos de');
		await page.click('#friend-foe-confirm');
		await expect(page.locator('#friend-foe-base-note')).toContainText('los equipos se cuentan al final');
		await expect(page.locator('#friend-foe-close')).toHaveText('GUARDARLAS');
	});
});
