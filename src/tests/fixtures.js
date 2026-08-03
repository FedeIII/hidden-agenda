import { test as base, expect } from '@playwright/test';
import createClickOn from './helpers/clickOn';
import createGet, { DIRECTION } from './helpers/get';
import createDrag from './helpers/drag';
import createNavigation from './helpers/navigation';

export const test = base.extend({
	// Overriding `page` rather than using an auto fixture means every spec receives a page that
	// is already on the app, with no ordering question against beforeEach hooks. Specs in the
	// `domain` project never ask for a page, so no browser is started for them.
	page: async ({ page }, use) => {
		// `?skin=dossier` pins the look. Every spec walks the real start → alignment flow, and the
		// hot-seat game draws a skin on the way in, so without this the suite would assert against
		// a randomly chosen one each run. A spec that navigates for itself has to carry the param
		// too — see three.test.js — unless it goes online, where the server's HA_SKIN covers it.
		await page.goto('/?skin=dossier');
		await page.addStyleTag({ content: '.piece-styled {transition: none !important;}' });

		await use(page);
	},

	// Any uncaught exception in the app fails the test that provoked it. The suite was once
	// fully green while clicking an empty cell threw a TypeError, because nothing watched.
	failOnPageError: [
		async ({ page }, use) => {
			const errors = [];

			page.on('pageerror', error => errors.push(error));

			await use();

			if (errors.length) {
				throw new Error(`uncaught page error(s):\n  ${errors.map(error => error.message).join('\n  ')}`);
			}
		},
		{ auto: true },
	],

	clickOn: async ({ page }, use) => use(createClickOn(page)),
	get: async ({ page }, use) => use(createGet(page)),
	drag: async ({ page }, use) => use(createDrag(page)),
	goToPlay: async ({ page }, use) => use(createNavigation(page)),
});

export { expect, DIRECTION };
