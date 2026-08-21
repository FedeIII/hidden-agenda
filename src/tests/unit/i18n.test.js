import { test, expect } from '@playwright/test';
import EN from 'Client/i18n/en';
import ES from 'Client/i18n/es';
import { LANGS, DEFAULT_LANG, translate, isLang } from 'Client/i18n';
import { RULES_PAGES as EN_PAGES, GROUPS as EN_GROUPS } from 'Phases/lobbyPhase/rules/content.en';
import { RULES_PAGES as ES_PAGES, GROUPS as ES_GROUPS } from 'Phases/lobbyPhase/rules/content.es';
import { EXERCISES } from 'Phases/lobbyPhase/training/exercises';
import { exerciseText } from 'Phases/lobbyPhase/training/text';
import { SKIN_WORDS } from 'Client/theme/tokens';
import { SKIN_NAMES } from 'Domain/skins';

// The two languages, held to the same shape — with no browser in the room.
//
// A translation rots in a way nothing else in this app does: it fails by being *absent*, and an
// absent string renders as the English one, which looks like a choice rather than a gap. Nothing
// throws, no spec goes red, and the only way anybody finds out is by reading the screen in Spanish.
// So this spec is the reader: it walks the English catalog and the English book and asserts that
// everything they say has a Spanish counterpart of the same kind.
//
// It is deliberately about *shape* rather than about words. Whether a sentence is good Spanish is
// not something a test can know. Whether it exists, is a string, keeps its placeholders and belongs
// to the same page is exactly what a test is for.

// Every leaf in a catalog, as `a.b.c` paths — which is how `t()` addresses them.
function paths(node, prefix = '') {
	if (typeof node === 'string') {
		return [prefix];
	}

	return Object.entries(node).flatMap(([key, value]) => paths(value, prefix ? `${prefix}.${key}` : key));
}

// `{name}`, `{count}` — the holes a caller fills. A translation that drops one renders the brace
// literally, and one that invents a new one renders it unfilled: both are visible on screen and
// neither would fail anything else.
function placeholders(text) {
	return [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
}

// What a rule page is made of, ignoring what it says. Two pages of the same page in two languages
// have to agree on this, or one of them is laid out differently from the other.
function shapeOf(page) {
	return {
		slug: page.slug,
		hasGroup: 'group' in page,
		imagesAtEnd: !!page.imagesAtEnd,
		image: page.image ? page.image.file : null,
		images: (page.images || []).map(image => image.file),
		imageGroups: (page.imageGroups || []).map(group => group.map(image => image.file)),
		body: (page.body || []).map(block => Object.keys(block).sort().join('+')),
		table: page.table ? { headers: page.table.headers.length, rows: page.table.rows.map(row => row.length) } : null,
		cheatSheet: page.cheatSheet ? page.cheatSheet.map(section => section.points.length) : null,
	};
}

test.describe('THE STRING CATALOG', () => {
	test('every language in LANGS has a catalog, and English is the default', () => {
		expect(LANGS).toContain(DEFAULT_LANG);
		expect(LANGS.every(isLang)).toBe(true);
		expect(isLang('fr')).toBe(false);
		expect(isLang(null)).toBe(false);
	});

	test('Spanish says everything English says', () => {
		const missing = paths(EN).filter(
			path => typeof translate('es', path) !== 'string' || translate('es', path) === path,
		);

		expect(missing, `keys with no Spanish entry:\n  ${missing.join('\n  ')}`).toEqual([]);
	});

	test('Spanish says nothing English does not', () => {
		const english = new Set(paths(EN));
		// A key only Spanish has is dead weight at best: nothing reads it, because every reader is a
		// `t()` call written against the English catalog. At worst it is a typo of a real key, which
		// leaves the real one falling back to English for ever.
		const extra = paths(ES).filter(path => !english.has(path));

		expect(extra, `keys Spanish has alone:\n  ${extra.join('\n  ')}`).toEqual([]);
	});

	test('both languages fill the same holes', () => {
		const wrong = paths(EN)
			.map(path => ({ path, en: placeholders(translate('en', path)), es: placeholders(translate('es', path)) }))
			.filter(({ en, es }) => en.join() !== es.join());

		expect(
			wrong,
			`placeholders do not match:\n  ${wrong.map(({ path, en, es }) => `${path}: en {${en}} vs es {${es}}`).join('\n  ')}`,
		).toEqual([]);
	});

	test('a missing key falls back to English, and an unknown key to itself', () => {
		// The two failure modes, both of which have to stay visible rather than render as nothing.
		expect(translate('es', 'app.title')).toBe(EN.app.title);
		expect(translate('en', 'nope.not.here')).toBe('nope.not.here');
		expect(translate('zz', 'play.nextTurn')).toBe(EN.play.nextTurn);
	});

	test('placeholders are filled, and an unknown one is left alone', () => {
		expect(translate('en', 'start.player', { n: 3 })).toBe('PLAYER 3');
		expect(translate('es', 'start.player', { n: 3 })).toBe('JUGADOR 3');
		// A caller that forgets a variable leaves the brace on screen, which is a bug that reports
		// itself — better than an empty gap in a sentence.
		expect(translate('en', 'start.player', {})).toContain('{n}');
	});

	test('the game is called the same thing in both languages', () => {
		expect(translate('es', 'app.title')).toBe(translate('en', 'app.title'));
	});

	test('every team index has a name in both languages', () => {
		for (const team of ['0', '1', '2', '3']) {
			for (const lang of LANGS) {
				expect(translate(lang, `team.${team}`), `team ${team} in ${lang}`).toMatch(/^[A-ZÁÉÍÓÚÑ]+$/);
			}
		}
	});
});

test.describe('THE RULE BOOK IN TWO LANGUAGES', () => {
	test('the same pages, in the same order, with the same slugs', () => {
		expect(ES_PAGES.map(page => page.slug)).toEqual(EN_PAGES.map(page => page.slug));
	});

	test('the same number of groups, and every page is in one of them', () => {
		expect(ES_GROUPS).toHaveLength(EN_GROUPS.length);

		// A page whose group is not in GROUPS never appears on the index — it is reachable only by
		// URL, and nothing says so.
		for (const [pages, groups, lang] of [
			[EN_PAGES, EN_GROUPS, 'en'],
			[ES_PAGES, ES_GROUPS, 'es'],
		]) {
			const orphans = pages.filter(page => page.group && !groups.includes(page.group)).map(page => page.slug);

			expect(orphans, `${lang} pages in no group: ${orphans.join(', ')}`).toEqual([]);
		}
	});

	test('every page is laid out identically in both languages', () => {
		expect(ES_PAGES.map(shapeOf)).toEqual(EN_PAGES.map(shapeOf));
	});

	test('every page says something in both languages', () => {
		for (const pages of [EN_PAGES, ES_PAGES]) {
			for (const page of pages) {
				expect(page.title, `${page.slug} has no title`).toBeTruthy();
				expect(page.teaser, `${page.slug} has no teaser`).toBeTruthy();
			}
		}
	});

	test('the emphasis markers close', () => {
		// The book is written with `**bold**` and `*italic*` and nothing else, and `renderInline` reads
		// exactly that. An opener with no closer is not an error there — it simply never matches, so
		// the asterisks print. That is the most likely thing to survive a translation, because the
		// words either side of a marker are the ones that changed.
		const strings = [];
		const walk = value => {
			if (typeof value === 'string') {
				strings.push(value);
			} else if (Array.isArray(value)) {
				value.forEach(walk);
			} else if (value && typeof value === 'object') {
				Object.values(value).forEach(walk);
			}
		};

		walk([EN_PAGES, ES_PAGES]);

		const unbalanced = strings.filter(text => (text.match(/\*\*/g) || []).length % 2 !== 0);

		expect(unbalanced, `an unclosed **:\n  ${unbalanced.join('\n  ')}`).toEqual([]);

		// A lone `*` with no partner, which prints as an asterisk in the middle of a sentence.
		const lonely = strings.filter(text => /(^|[^*])\*($|[^*])/.test(text) && !/\*[^*]+\*/.test(text));

		expect(lonely, `a stray *:\n  ${lonely.join('\n  ')}`).toEqual([]);
	});

	test('every photograph is described in both languages', () => {
		const alts = pages =>
			pages.flatMap(page => [
				...(page.image ? [page.image] : []),
				...(page.images || []),
				...(page.imageGroups || []).flat(),
			]);

		for (const image of [...alts(EN_PAGES), ...alts(ES_PAGES)]) {
			expect(image.alt, `${image.file} has no alt text`).toBeTruthy();
			expect(image.caption, `${image.file} has no caption`).toBeTruthy();
		}
	});
});

test.describe('THE COURSE IN TWO LANGUAGES', () => {
	test('every exercise has a verb for every step, in every language', () => {
		for (const lang of LANGS) {
			for (const exercise of EXERCISES) {
				const said = exerciseText(exercise, lang);

				expect(said.title, `${exercise.slug} title in ${lang}`).toBeTruthy();
				expect(said.finding, `${exercise.slug} finding in ${lang}`).toBeTruthy();
				expect(said.steps, `${exercise.slug} steps in ${lang}`).toHaveLength(exercise.steps.length);

				said.steps.forEach((step, at) => {
					expect(step.verb, `${exercise.slug} step ${at + 1} verb in ${lang}`).toBeTruthy();
				});
			}
		}
	});

	test('a translated finding stays a finding rather than a paragraph', () => {
		// The English course holds itself to eight words in unit/training.test.js, because the finding
		// is one line on a card and a paragraph there is a card that scrolls. A translation is under
		// the same roof.
		for (const lang of LANGS) {
			for (const exercise of EXERCISES) {
				const said = exerciseText(exercise, lang);

				expect(said.finding.split(' ').length, `${exercise.slug}'s ${lang} finding is a paragraph`).toBeLessThanOrEqual(
					9,
				);
			}
		}
	});

	test('an exercise with a note in English has one in Spanish', () => {
		for (const exercise of EXERCISES) {
			const hasNote = Boolean(exerciseText(exercise, 'en').note);

			expect(Boolean(exerciseText(exercise, 'es').note), `${exercise.slug} note`).toBe(hasNote);
		}
	});

	test('a verb is short enough to be stamped', () => {
		// It is set in caps on a rubber stamp about a hundred pixels wide. The English longest is
		// "PUT DOWN"; anything much past that overruns rather than wraps.
		for (const lang of LANGS) {
			for (const exercise of EXERCISES) {
				for (const step of exerciseText(exercise, lang).steps) {
					expect(step.verb.length, `${exercise.slug}: "${step.verb}" (${lang})`).toBeLessThanOrEqual(11);
				}
			}
		}
	});
});

test.describe('THE SKINS SPEAK BOTH LANGUAGES', () => {
	test('every skin has every word in every language', () => {
		const tokens = Object.keys(SKIN_WORDS[SKIN_NAMES[0]][DEFAULT_LANG]);

		expect(tokens.length).toBeGreaterThan(0);

		for (const skin of SKIN_NAMES) {
			for (const lang of LANGS) {
				expect(Object.keys(SKIN_WORDS[skin][lang]).sort(), `${skin}/${lang}`).toEqual([...tokens].sort());
			}
		}
	});

	test('no word can swallow its own stylesheet', () => {
		// stylis strips `//` and cannot cope with a bare `(` inside a quoted value, and either one
		// silently eats the rest of the block *and* its closing brace — see the header note in
		// theme/tokens.js. Nothing throws and every control still looks right; the page simply has no
		// ground. A translation is the most likely place for a stray bracket to arrive.
		for (const skin of SKIN_NAMES) {
			for (const lang of LANGS) {
				for (const [token, value] of Object.entries(SKIN_WORDS[skin][lang])) {
					expect(value, `${skin}/${lang} ${token}`).not.toMatch(/[()/\\]/);
					// A quoted CSS string, always — `content` takes nothing else, and an unquoted word
					// there is a declaration the browser drops.
					expect(value, `${skin}/${lang} ${token} is not quoted`).toMatch(/^'.*'$/);
				}
			}
		}
	});
});
