import { test, expect } from './fixtures';

// How to Play is a book: a page of it is a long read, and on a phone it is a very long one. What
// this covers is getting from one page to the next — where the controls are, and where the reader
// lands after using them.

// The front door, not `?hotseat`: How to Play hangs off the lobby menu, and the shared fixture
// lands every other spec straight in a one-tab game where there is no menu to open it from.
//
// Through the menu rather than to the hash directly, too. The whole screen is one mounted component
// and the hash is written by it, so navigating to `#/rules/…` from a page already on that URL is a
// same-document change the app never hears about — and it is the click path that is worth testing.
async function openRule(page, slug) {
	await page.goto('/');
	await page.click('#lobby-menu-rules');
	await page.click(`#rules-open-${slug}`);
}

// `.game` is the scrollport, not the document — it is absolutely positioned over the viewport with
// `overflow-y: auto`, so window.scrollY is 0 no matter how far down the page you are.
const scrollTop = page => page.evaluate(() => document.querySelector('.game').scrollTop);

const readToTheBottom = page =>
	page.evaluate(() => {
		const scrollport = document.querySelector('.game');
		scrollport.scrollTop = scrollport.scrollHeight;
	});

test.describe('THE RULE BOOK', () => {
	test('a page carries the pager at both ends and the way out only at the top', async ({ page }) => {
		await openRule(page, 'the-spy');

		await expect(page.locator('#rules-prev-top')).toBeVisible();
		await expect(page.locator('#rules-next-top')).toBeVisible();
		await expect(page.locator('#rules-prev-bottom')).toBeVisible();
		await expect(page.locator('#rules-next-bottom')).toBeVisible();

		// Leaving the book is a different decision from turning a page in it, and is not repeated.
		await expect(page.locator('#rules-main-menu')).toHaveCount(1);
		await expect(page.locator('#rules-index')).toHaveCount(1);

		// The head's pair are glyphs — a band of chrome saved on the screen with least of it — so
		// they say where they go to the label rather than to the eye. The foot spells both out.
		await expect(page.locator('#rules-prev-top')).toHaveAttribute('aria-label', /The CEO/);
		await expect(page.locator('#rules-next-top')).toHaveAttribute('aria-label', /The Sniper/);
		await expect(page.locator('#rules-prev-bottom')).toContainText('The CEO');
		await expect(page.locator('#rules-next-bottom')).toContainText('The Sniper');
	});

	test('the first page offers no way back, at either end', async ({ page }) => {
		await openRule(page, 'cheat-sheet');

		await expect(page.locator('#rules-next-top')).toBeVisible();
		await expect(page.locator('#rules-next-bottom')).toBeVisible();
		await expect(page.locator('#rules-prev-top')).toHaveCount(0);
		await expect(page.locator('#rules-prev-bottom')).toHaveCount(0);
	});

	// Every view here is the same mounted component with different props, so nothing resets the
	// scroll on its own: turning the page from the bottom used to drop the reader that far down the
	// next one, past its title and most of the way past its picture.
	test('turning the page starts the next one at the top', async ({ page }) => {
		await openRule(page, 'the-spy');

		await readToTheBottom(page);
		expect(await scrollTop(page)).toBeGreaterThan(100);

		await page.click('#rules-next-bottom');

		await expect(page.locator('#rules-prev-top')).toHaveAttribute('aria-label', /The Spy/);
		expect(await scrollTop(page)).toEqual(0);
	});

	test('so does stepping back, and going to the index', async ({ page }) => {
		await openRule(page, 'the-spy');

		await readToTheBottom(page);
		await page.click('#rules-prev-bottom');

		await expect(page.locator('#rules-next-top')).toHaveAttribute('aria-label', /The Spy/);
		expect(await scrollTop(page)).toEqual(0);

		await readToTheBottom(page);
		await page.click('#rules-index');

		expect(await scrollTop(page)).toEqual(0);
	});

	test.describe('on a phone', () => {
		test.use({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });

		// The header, the way out, the title and the pager used to stack four deep and eat 210px of
		// a 700px screen before the first word — nearly a third of it, on the device with the least
		// to give. The title and the pager share a line now and the frame around them is tighter.
		//
		// A budget rather than a number: what matters is that a reader arrives at the page rather
		// than at the furniture, and it is the drift back that this is here to catch.
		test('the page starts within the first fifth of the screen', async ({ page }) => {
			await openRule(page, 'the-spy');

			const chromeEndsAt = await page
				.locator('#rules-next-top')
				.evaluate(el => Math.round(el.getBoundingClientRect().bottom));

			expect(chromeEndsAt).toBeLessThan(160);
		});

		// The caption is pinned under the photograph rather than into a fixed strip at the foot of
		// the mat. It was 68px of reserved room for text that wraps, so a caption long enough to
		// need a fourth line grew upwards over the picture — which is what a phone does to it.

		for (const slug of ['the-spy', 'ceo-buffs']) {
			test(`a caption never covers its photograph — ${slug}`, async ({ page }) => {
				await openRule(page, slug);

				await expect(page.locator('figcaption').first()).toBeVisible();

				const overlaps = await page.evaluate(() =>
					[...document.querySelectorAll('figcaption')].map(tag => {
						const image = tag.closest('figure').querySelector('img');

						return image.getBoundingClientRect().bottom - tag.getBoundingClientRect().top;
					}),
				);

				for (const overlap of overlaps) {
					expect(overlap).toBeLessThanOrEqual(0);
				}
			});
		}
	});
});
