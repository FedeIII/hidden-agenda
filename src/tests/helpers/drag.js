async function centreOf(selector) {
	return page.$eval(selector, element => {
		const rect = element.getBoundingClientRect();

		return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
	});
}

// Drives a real pointer gesture: press, move past the drag threshold, move to the target,
// release. Only testable since dragging stopped going through the HTML5 drag-and-drop API,
// which puppeteer cannot drive.
export async function dragFromTo(fromSelector, toSelector) {
	const from = await centreOf(fromSelector);
	const to = await centreOf(toSelector);

	await page.mouse.move(from.x, from.y);
	await page.mouse.down();
	// Two moves: the first crosses the threshold and begins the drag, the second travels.
	await page.mouse.move(from.x + 10, from.y + 10);
	await page.mouse.move(to.x, to.y);
	await page.mouse.up();

	await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)));
}

// The reason pointer events replaced react-dnd: HTML5 drag-and-drop never fires on touch, so
// this gesture was simply impossible on a phone before.
export async function touchDragFromTo(fromSelector, toSelector) {
	const from = await centreOf(fromSelector);
	const to = await centreOf(toSelector);

	const client = await page.target().createCDPSession();
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

	await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)));
	await client.detach();
}

export async function pressWithoutMoving(selector) {
	const at = await centreOf(selector);

	await page.mouse.move(at.x, at.y);
	await page.mouse.down();
	await page.mouse.up();

	await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)));
}

export default { dragFromTo, pressWithoutMoving };
