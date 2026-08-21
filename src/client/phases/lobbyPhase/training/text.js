import { DEFAULT_LANG } from 'Client/i18n';
import { EXERCISES_ES } from './exercises.es';

// The words an exercise says, in the reader's language.
//
// `exercises.js` is the course: the boards, the gate on each step and the predicate that closes it,
// all in one place. It carries the English wording inline because that is where a step's verb is
// written next to the click it names — which is the only way a lesson stays honest — and it is what
// the domain spec walks.
//
// So a translation is an overlay rather than a second course. It supplies words by slug and by step
// position, and anything it does not supply falls through to the English. A missing verb reads as
// English; a missing *step* is impossible, because the steps here are the English ones with their
// words replaced.

const OVERLAYS = { es: EXERCISES_ES };

function overlayFor(exercise, lang) {
	const overlay = OVERLAYS[lang];

	return (overlay && overlay[exercise.slug]) || null;
}

/**
 * One exercise's prose: its title, its finding, its optional note, and one `{ verb, hint }` per
 * step — in step order, so the runner indexes it exactly as it indexes `exercise.steps`.
 *
 * A plain function rather than a hook, because the course head localises ten of these in a loop and
 * hooks cannot be called in one. `useLang()` at the top of the component supplies `lang`.
 */
export function exerciseText(exercise, lang = DEFAULT_LANG) {
	const said = overlayFor(exercise, lang);

	return {
		title: (said && said.title) || exercise.title,
		finding: (said && said.finding) || exercise.finding,
		note: (said && said.note) || exercise.note,
		steps: exercise.steps.map((step, at) => {
			const line = (said && said.steps && said.steps[at]) || null;

			return {
				verb: (line && line.verb) || step.verb,
				// `||` and not `??`: an overlay that leaves a hint out has nothing to say about it, and
				// the English hint is the better answer than none. A step with no hint in either
				// language is simply undefined, which is what the runner already checks for.
				hint: (line && line.hint) || step.hint,
			};
		}),
	};
}

export default exerciseText;
