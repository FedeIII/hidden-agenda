import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useCellAction from 'Hooks/useCellAction';
import { getHand, setDragging } from 'Client/three/flight';

// Replaces react-dnd + react-dnd-html5-backend + dnd-core + redux (67 kB of the bundle).
//
// The HTML5 drag-and-drop API does not fire on touch devices at all, so on a phone the game
// could only be played by tapping. Pointer events cover mouse, touch and pen with one path.
//
// The gesture is deliberately thin, because dragging a piece never meant anything more than
// "select this piece, then act on the cell you let go over" — both of which already exist.

const DRAG_THRESHOLD_PX = 6;
const GHOST_OPACITY = 0.85;

const DragContext = createContext({
	startDrag: () => {},
	isClickSuppressed: () => false,
});

export function useDragController() {
	return useContext(DragContext);
}

// The ghost is pointer-events: none, so this always resolves to what is underneath it. Pieces
// are children of their hexagon, hence the closest() rather than an id test on the hit element.
function cellAtPoint(x, y) {
	const element = document.elementFromPoint(x, y);
	const hexagon = element && element.closest('[id^="hex-"]');

	if (!hexagon) {
		return null;
	}

	const coords = /^hex-(-?\d+)-(-?\d+)$/.exec(hexagon.id);

	return coords ? [Number(coords[1]), Number(coords[2])] : null;
}

function DragGhost({ ghost }) {
	if (!ghost) {
		return null;
	}

	return (
		<img
			src={ghost.src}
			alt=""
			aria-hidden="true"
			style={{
				position: 'fixed',
				left: ghost.x - ghost.width / 2,
				top: ghost.y - ghost.height / 2,
				width: ghost.width,
				height: ghost.height,
				opacity: GHOST_OPACITY,
				pointerEvents: 'none',
				zIndex: 1000,
			}}
		/>
	);
}

export function DragProvider({ children }) {
	const cellAction = useCellAction();
	const [ghost, setGhost] = useState(null);

	// Held in a ref so the window listeners can stay mounted once instead of resubscribing on
	// every state change: cellAction's identity changes whenever pieces do. Written in an effect
	// rather than during render — the listeners only read it from a pointer event, which is
	// always after commit, so there is nothing to gain from touching a ref mid-render.
	const cellActionRef = useRef(cellAction);

	useEffect(() => {
		cellActionRef.current = cellAction;
	}, [cellAction]);

	const gesture = useRef(null);
	const suppressClick = useRef(false);

	const startDrag = useCallback((event, { previewSrc, pieceId, onStart }) => {
		// Primary button only; touch and pen report button 0 too.
		if (typeof event.button === 'number' && event.button !== 0) {
			return;
		}

		const rect = event.currentTarget.getBoundingClientRect();

		gesture.current = {
			originX: event.clientX,
			originY: event.clientY,
			width: rect.width,
			height: rect.height,
			previewSrc,
			pieceId,
			onStart,
			dragging: false,
			carried: false,
		};
	}, []);

	const isClickSuppressed = useCallback(() => suppressClick.current, []);

	useEffect(() => {
		function onPointerMove(event) {
			const current = gesture.current;

			if (!current) {
				return;
			}

			const dx = event.clientX - current.originX;
			const dy = event.clientY - current.originY;

			if (!current.dragging) {
				if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD_PX) {
					return;
				}

				current.dragging = true;
				current.onStart();

				// The renderer picks the piece up itself, and then there is nothing for a flat
				// picture of it to do. Without one it stays a dragged image, which is what this
				// looked like before and is the thing that gave it away as a web page.
				const hand = getHand();

				current.carried = !!(hand && current.pieceId && hand.grab(current.pieceId));

				if (current.carried) {
					setDragging(current.pieceId);
				}
			}

			if (current.carried) {
				getHand().carryTo(event.clientX, event.clientY);

				return;
			}

			setGhost({
				src: current.previewSrc,
				x: event.clientX,
				y: event.clientY,
				width: current.width,
				height: current.height,
			});
		}

		function onPointerUp(event) {
			const current = gesture.current;

			gesture.current = null;
			setGhost(null);

			if (current && current.carried) {
				const hand = getHand();

				if (hand) {
					hand.drop();
				}

				setDragging(null);
			}

			if (!current || !current.dragging) {
				// A tap. Leave it alone: the piece's onClick handles selection.
				return;
			}

			// A click still follows pointerup when press and release share an ancestor, which
			// would run the cell action twice. Cleared on the next macrotask, after that click.
			suppressClick.current = true;
			setTimeout(() => {
				suppressClick.current = false;
			}, 0);

			const coords = cellAtPoint(event.clientX, event.clientY);

			if (coords) {
				cellActionRef.current(coords);
			}
		}

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);

		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('pointercancel', onPointerUp);
		};
	}, []);

	return (
		<DragContext.Provider value={{ startDrag, isClickSuppressed }}>
			{children}
			<DragGhost ghost={ghost} />
		</DragContext.Provider>
	);
}

export default DragProvider;
