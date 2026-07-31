export default function createDrag(page) {
	async function centreOf(selector) {
		const box = await page.locator(selector).boundingBox();

		return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
	}

	return {
		// A real pointer gesture: press, cross the drag threshold, travel, release. Only
		// testable since dragging stopped going through the HTML5 drag-and-drop API.
		async fromTo(fromSelector, toSelector) {
			const from = await centreOf(fromSelector);
			const to = await centreOf(toSelector);

			await page.mouse.move(from.x, from.y);
			await page.mouse.down();
			await page.mouse.move(from.x + 10, from.y + 10);
			await page.mouse.move(to.x, to.y);
			await page.mouse.up();
		},

		// The reason pointer events replaced react-dnd: HTML5 drag-and-drop never fires on
		// touch, so this gesture was impossible on a phone before. page.touchscreen only taps,
		// hence the CDP session.
		async byTouchFromTo(fromSelector, toSelector) {
			const from = await centreOf(fromSelector);
			const to = await centreOf(toSelector);

			const client = await page.context().newCDPSession(page);
			await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });

			const touch = (type, x, y) =>
				client.send('Input.dispatchTouchEvent', {
					type,
					touchPoints: type === 'touchEnd' ? [] : [{ x, y, radiusX: 5, radiusY: 5, force: 1, id: 0 }],
				});

			await touch('touchStart', from.x, from.y);
			await touch('touchMove', from.x + 10, from.y + 10);
			await touch('touchMove', to.x, to.y);
			await touch('touchEnd', to.x, to.y);

			await client.detach();
		},

		async pressWithoutMoving(selector) {
			const at = await centreOf(selector);

			await page.mouse.move(at.x, at.y);
			await page.mouse.down();
			await page.mouse.up();
		},
	};
}
