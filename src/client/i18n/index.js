import { cloneElement, isValidElement, useCallback, useEffect, useSyncExternalStore } from 'react';
import EN from './en';
import ES from './es';

// Which language the interface is written in, and the one place that fact lives.
//
// A store outside React rather than a context, for the same reason the session is one: the language
// is a property of the browser rather than of a subtree, `t()` is wanted in a plain function as
// often as in a component, and a provider around the whole app would put every screen one more
// wrapper deep for a value that changes twice an evening at most.
//
// Nothing here is game state. The server never sends a language and never needs to know one: two
// people at the same table can read the same room in two languages, because every string is chosen
// on the client out of a catalog and none of them crosses the wire.

export const LANGS = ['en', 'es'];

// English is the fallback as well as the default, so a key missing from `es` shows the English
// sentence rather than a raw key. A gap in a translation should look like a gap in a translation.
export const DEFAULT_LANG = 'en';

const CATALOGS = { en: EN, es: ES };

const STORAGE_KEY = 'ha-lang';

export function isLang(value) {
	return LANGS.includes(value);
}

// `?lang=es` pins the language for one page load without writing anything down — the same contract
// `?skin=` has. It is what a shared link carries and what the browser suite pins itself with, and
// neither should quietly rewrite the preference of whoever opens it.
function fromQuery() {
	if (typeof window === 'undefined') {
		return null;
	}

	const asked = new URLSearchParams(window.location.search).get('lang');

	return isLang(asked) ? asked : null;
}

// Wrapped because storage throws rather than returns null in a browser that has it switched off,
// and a language preference is not worth taking the app down for.
function fromStorage() {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);

		return isLang(stored) ? stored : null;
	} catch {
		return null;
	}
}

function remember(lang) {
	try {
		window.localStorage.setItem(STORAGE_KEY, lang);
	} catch {
		// A browser with storage off still gets the language for as long as the tab is open.
	}
}

// `navigator.language` is 'es-ES', 'es-419', 'en-GB' — a tag, not a language — so only the part
// before the hyphen is ours to read.
function fromBrowser() {
	const tags = typeof navigator === 'undefined' ? [] : navigator.languages || [navigator.language];

	for (const tag of tags) {
		const base = String(tag || '')
			.toLowerCase()
			.split('-')[0];

		if (isLang(base)) {
			return base;
		}
	}

	return null;
}

function detect() {
	return fromQuery() || fromStorage() || fromBrowser() || DEFAULT_LANG;
}

let current = detect();
const listeners = new Set();

export function getLang() {
	return current;
}

export function setLang(lang) {
	if (!isLang(lang) || lang === current) {
		return;
	}

	current = lang;
	remember(lang);
	listeners.forEach(listener => listener());
}

export function subscribe(listener) {
	listeners.add(listener);

	return () => listeners.delete(listener);
}

function lookup(catalog, key) {
	return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), catalog);
}

// `{name}` rather than a positional marker, because a translator moving a placeholder to the other
// end of the sentence is the normal case and a number there says nothing about what belongs in it.
function fill(text, vars) {
	return text.replace(/\{(\w+)\}/g, (whole, name) => (name in vars ? String(vars[name]) : whole));
}

/**
 * One string, in one language.
 *
 * Falls back through English and then to the key itself, so a missing entry is visible on screen
 * instead of rendering as nothing at all — an empty button is a bug that hides, and `lobby.join` in
 * the middle of a panel is a bug that reports itself.
 */
export function translate(lang, key, vars) {
	const asked = lookup(CATALOGS[lang] || CATALOGS[DEFAULT_LANG], key);
	const text = typeof asked === 'string' ? asked : lookup(CATALOGS[DEFAULT_LANG], key);

	if (typeof text !== 'string') {
		return key;
	}

	return vars ? fill(text, vars) : text;
}

/**
 * The same string, in the same language, with room for an element inside it.
 *
 * `t()` can only give text back, so a sentence that wants one of its placeholders typed differently
 * from the words around it — a player's name in the accent colour — has nowhere to put the markup.
 * This returns the sentence in pieces instead: the words between the placeholders, and whatever each
 * placeholder was given, string or element. The catalog still holds the whole sentence, and `{name}`
 * still goes wherever the translator put it.
 *
 * The split is on the template, before anything is filled in. Splitting the finished sentence would
 * mean hunting for the name inside it, and a player called S cuts "This is only for S's eyes" into
 * pieces in three wrong places.
 */
export function translateParts(lang, key, vars = {}) {
	return translate(lang, key)
		.split(/(\{\w+\})/)
		.filter(piece => piece !== '')
		.map((piece, index) => {
			const placeholder = /^\{(\w+)\}$/.exec(piece);
			const value = placeholder && placeholder[1] in vars ? vars[placeholder[1]] : piece;

			// React asks for a key on every element in an array, and a caller writing
			// `{ name: <PlayerName>…</PlayerName> }` should not have to know it is going into one.
			return isValidElement(value) ? cloneElement(value, { key: index }) : value;
		});
}

// The module-level reader, for the handful of places that need a string outside a render: a
// `document.title`, an aria label built in a helper, a plain function shared with a component.
export function t(key, vars) {
	return translate(current, key, vars);
}

export function useLang() {
	return useSyncExternalStore(subscribe, getLang, () => DEFAULT_LANG);
}

/**
 * The hook every screen uses.
 *
 * It returns a function rather than the catalog, so a component names the key it wants and nothing
 * else — and because the identity of that function changes with the language, a `useMemo` or a
 * `useCallback` that depends on it re-runs when the language does. Reading a catalog object would
 * have to remember to depend on the language separately, and eventually would not.
 */
export function useT() {
	const lang = useLang();

	return useCallback((key, vars) => translate(lang, key, vars), [lang]);
}

// The same hook for the few sentences that have an element in the middle of them. Separate from
// `useT` rather than a flag on it, because the two return different kinds of thing and a screen
// should not have to read the arguments to know which one it is getting.
export function useTParts() {
	const lang = useLang();

	return useCallback((key, vars) => translateParts(lang, key, vars), [lang]);
}

export function useSetLang() {
	return setLang;
}

// `<html lang>` for real, not decoration: it is what a screen reader picks a voice from, what a
// browser offers to translate against, and what CSS hyphenation and quotes read. index.html ships
// `lang="en"` so the first paint is never unlabelled, and this corrects it.
export function useLangAttribute() {
	const lang = useLang();

	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);
}

export default useT;
