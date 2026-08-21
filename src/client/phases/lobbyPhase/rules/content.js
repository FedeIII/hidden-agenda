import { DEFAULT_LANG, useLang } from 'Client/i18n';
import { GROUPS as EN_GROUP_NAMES, RULES_PAGES as EN_PAGES } from './content.en';
import { GROUPS as ES_GROUP_NAMES, RULES_PAGES as ES_PAGES } from './content.es';

// Which book the reader is holding.
//
// The pages are content rather than chrome — paragraphs, lists, captions, one table — so they are
// authored per language in the shape they are read in rather than flattened into the string
// catalog. What that buys is a translator working on whole sentences in order, with the picture
// they describe named on the line above. What it costs is a second file to keep in step, which is
// what `src/tests/unit/i18n.test.js` is for.
//
// A slug is not translated. It is in the URL, so `#/rules/the-spy` has to open the same page for
// everybody — a shared link is the one thing about this book that crosses between two languages.

const BOOKS = {
	en: { groups: EN_GROUP_NAMES, pages: EN_PAGES },
	es: { groups: ES_GROUP_NAMES, pages: ES_PAGES },
};

function book(lang) {
	return BOOKS[lang] || BOOKS[DEFAULT_LANG];
}

export function rulesPages(lang) {
	return book(lang).pages;
}

export function ruleGroups(lang) {
	return book(lang).groups;
}

/**
 * One page by slug.
 *
 * `lang` is optional because two of the three callers only want to know whether a slug names a page
 * at all — validating a hash before turning it into a view. Slugs are shared, so the English book
 * answers that for every language.
 */
export function findRulePage(slug, lang = DEFAULT_LANG) {
	return rulesPages(lang).find(page => page.slug === slug) || null;
}

// The hooks the book itself reads. A component asking for pages gets the reader's own language
// without having to thread it down, and re-renders when it changes.
export function useRulesPages() {
	return rulesPages(useLang());
}

export function useRuleGroups() {
	return ruleGroups(useLang());
}

export function useRulePage(slug) {
	return findRulePage(slug, useLang());
}

// The English book by name, for the two specs that read the structure rather than the words: it is
// the one that has to exist, and the one every translation is compared against.
export { EN_PAGES as RULES_PAGES, EN_GROUP_NAMES as GROUPS };

export default rulesPages;
