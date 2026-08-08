import { useEffect, useRef } from 'react';
import { MarkLayer, Mark, MarkTag } from './components';

// Rings drawn over the thing to click.
//
// They follow their target from a frame loop rather than being laid out beside it, and that is the
// whole design: the board is drawn in WebGL and every hexagon is a transparent box projected onto a
// tile, so where a cell lands is decided by a camera fit that answers to the window, the scroll and
// the 3D layout all at once. Asking the element where it is, every frame, is the only reading that
// cannot drift from what the player is looking at.
//
// Nothing here takes a pointer event, and that is not a detail: the elements underneath ARE the
// game, and an absolutely positioned box over a hexagon eats the click that would have moved a
// piece — see `BoardMarks`, which exists under the same rule.

// How far outside its target each kind of mark is drawn. A ring wants air around the token; the
// sight is the cell itself.
const OUTSET = { target: 5, deny: 5, sight: 1 };

// The largest corner a ring is allowed. Below twice this the mark comes out a circle, which is what
// a cell and a token want; above it, a rounded rectangle, which is what a whole card wants.
const MAX_RING = 40;

// Writing a style property that is already that value still costs a CSSOM write and, in a loop that
// runs sixty times a second over every mark, a good deal of pointless work.
function set(node, property, value) {
	if (node.style[property] !== value) {
		node.style[property] = value;
	}
}

// The ring's corner is read by two pseudo-elements, which cannot be reached from a style property —
// so it travels as a custom property on the element they hang off.
function setRadius(node, value) {
	if (node.style.getPropertyValue('--ha-training-ring') !== value) {
		node.style.setProperty('--ha-training-ring', value);
	}
}

function hide(node) {
	set(node, 'opacity', '0');
}

// `.game` is the scrollport, and the mark layer is fixed to the viewport rather than inside it — so
// a target scrolled up behind the running head is still perfectly measurable and must not be drawn.
function clipRect() {
	const scrollport = document.querySelector('.game');

	return scrollport ? scrollport.getBoundingClientRect() : null;
}

function follow(node, clip) {
	const target = document.getElementById(node.dataset.for);

	if (!target) {
		hide(node);

		return;
	}

	const rect = target.getBoundingClientRect();

	if (rect.width < 1 || rect.height < 1) {
		hide(node);

		return;
	}

	const midY = rect.top + rect.height / 2;

	if (clip && (midY < clip.top || midY > clip.bottom)) {
		hide(node);

		return;
	}

	if (node.dataset.tag) {
		set(node, 'left', `${Math.round(rect.left + rect.width / 2)}px`);
		set(node, 'top', `${Math.round(midY)}px`);
	} else {
		const outset = Number(node.dataset.outset) || 0;
		const width = Math.round(rect.width + outset * 2);
		const height = Math.round(rect.height + outset * 2);

		set(node, 'left', `${Math.round(rect.left - outset)}px`);
		set(node, 'top', `${Math.round(rect.top - outset)}px`);
		set(node, 'width', `${width}px`);
		set(node, 'height', `${height}px`);
		// Round on something square — a hexagon's box, a token — and merely round-cornered on
		// something long, or a whole card would be ringed by a stadium it stands inside.
		setRadius(node, `${Math.round(Math.min(width, height, MAX_RING * 2) / 2)}px`);
	}

	set(node, 'opacity', '1');
}

/**
 * @param {{ id: string, kind: 'target' | 'deny' | 'sight' }[]} marks  what to ring, by DOM id
 * @param {{ id: string, text: string }} [tag]                        one caption, on one of them
 */
export default function CoachMarks({ marks, tag }) {
	const layerRef = useRef(null);

	// Mounted once and left running for as long as the layer is. The children change with every
	// step; the loop simply reads whatever is there, so it never has to be torn down and rebuilt.
	useEffect(() => {
		let frame = requestAnimationFrame(function tick() {
			frame = requestAnimationFrame(tick);

			const layer = layerRef.current;

			if (!layer) {
				return;
			}

			const clip = clipRect();

			for (const node of layer.children) {
				follow(node, clip);
			}
		});

		return () => cancelAnimationFrame(frame);
	}, []);

	return (
		<MarkLayer ref={layerRef} aria-hidden="true">
			{marks.map(mark => (
				<Mark
					key={`${mark.kind}-${mark.id}`}
					id={`training-mark-${mark.id}`}
					$kind={mark.kind}
					data-for={mark.id}
					data-outset={OUTSET[mark.kind]}
				/>
			))}

			{tag && (
				<MarkTag key={tag.id} data-for={tag.id} data-tag="1">
					{tag.text}
				</MarkTag>
			)}
		</MarkLayer>
	);
}
