import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { onDragChange } from './flight';
import getStage, { hasStageFailed, onStageFailure } from './stage';
import isWebGLAvailable from './support';

const isEnabled = () => isWebGLAvailable() && !hasStageFailed();
const neverEnabled = () => false;

/**
 * Whether anything is being drawn in 3D at all.
 *
 * Not a constant: a context can be lost at any moment, and when it is, every component that had
 * gone transparent has to become visible again in the same commit. Hence an external store rather
 * than a module flag read once.
 */
export function useThreeEnabled() {
	return useSyncExternalStore(onStageFailure, isEnabled, neverEnabled);
}

/**
 * Binds a scene to a DOM element and hands back where that scene's contents land on screen.
 *
 * The returned layout is the contract between the two renderers: keys to CSS pixel boxes, in the
 * element's own coordinates, ready for an absolutely positioned child. It is recomputed only when
 * the element changes size — never per frame, and never from anything the animation is doing —
 * because those boxes are what the game is clicked on, and playwright refuses to click a box that
 * is still moving.
 */
export default function useThreeView(elementRef, createScene, state) {
	const enabled = useThreeEnabled();
	const [layout, setLayout] = useState(null);

	const sceneRef = useRef(null);
	const viewRef = useRef(null);
	const measureRef = useRef(null);
	const stateRef = useRef(state);

	// So that a scene built later — after a context is lost and regained, or when a view is
	// remounted — opens on the state the game is actually in rather than on an empty board.
	useEffect(() => {
		stateRef.current = state;
	});

	useLayoutEffect(() => {
		const element = elementRef.current;

		if (!enabled || !element) {
			return;
		}

		const stage = getStage();

		if (!stage) {
			return;
		}

		const scene = createScene(element);
		sceneRef.current = scene;
		scene.setState(stateRef.current);

		let width = 0;
		let height = 0;

		function measure() {
			const rect = element.getBoundingClientRect();

			if (rect.width < 1 || rect.height < 1) {
				return;
			}

			if (rect.width === width && rect.height === height) {
				return;
			}

			width = rect.width;
			height = rect.height;

			scene.resize(width, height);
			setLayout(scene.layout());
		}

		// Before the browser paints, so the overlay is never briefly stacked in the top left
		// corner waiting for the first frame.
		measure();
		measureRef.current = measure;

		const handle = stage.addView({
			element,
			scene: scene.scene,
			camera: scene.camera,
			onResize: measure,
			extent: scene.extent,
			well: scene.well,
			overlay: scene.overlay,
			widen: scene.widen,
			order: scene.order,
			update: delta => scene.update(delta),
		});

		viewRef.current = handle;

		// A scene that draws the piece in the player's hand needs telling when that changes, and one
		// that has to stop drawing it needs telling too. Both answer the same question.
		const forgetDrag = scene.setDragging
			? onDragChange(pieceId => {
					scene.setDragging(pieceId);
					handle.invalidate();
				})
			: null;

		return () => {
			if (forgetDrag) {
				forgetDrag();
			}

			handle.remove();
			scene.dispose();
			sceneRef.current = null;
			viewRef.current = null;
			measureRef.current = null;
			setLayout(null);
		};
	}, [enabled, elementRef, createScene]);

	// Again after every commit, because handing back a layout is itself what changes the size the
	// layout was measured from: a container with no 3D in it yet is laid out by the flat renderer's
	// rules, and switching it over changes its height. Measuring once would leave the first painted
	// frame — and the boxes clicks land on — fitted to a box that no longer exists. It costs one
	// bounding-box read when nothing has moved.
	useLayoutEffect(() => {
		if (measureRef.current) {
			measureRef.current();
		}
	});

	useEffect(() => {
		const scene = sceneRef.current;

		if (!scene) {
			return;
		}

		// A scene that says nothing changed does not get repainted. Every dispatch gives the whole
		// state tree a new identity, so this is the difference between one view redrawing and all
		// five redrawing on a change that touched none of them.
		if (scene.setState(state) !== false && viewRef.current) {
			viewRef.current.invalidate();
		}
	}, [state]);

	// Never a layout while disabled, so every component can treat "no layout" as "render flat".
	return enabled ? layout : null;
}
