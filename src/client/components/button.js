import styled, { css, keyframes } from 'styled-components';

// One component, three looks, no extra classes.
//
// Every difference between a Dossier rubber stamp, a Blueprint drafted control and a Vault brass
// switch is a custom property, so styled-components injects this rule once and the skin resolves
// against <html>. Interpolating theme values into the template instead would mint a second and
// third class for every button in the app — see theme/tokens.js.
//
// The disabled state is deliberately not "greyed": in an online game a control is dark because it
// is not your turn, which is a different thing from broken. Each skin says so in its own way — a
// dashed stamp outline, an unlit chalk rectangle, a switch with no brass in it.

const size = ({ small }) => {
	if (small) {
		return css`
			font-size: 13px;
		`;
	}
};

// The one loud control at the table. Filled rather than outlined, and in Dossier round, because a
// snipe is an authorisation the rest of the table gives — the shape a stamp has.
const asPrimary = css`
	color: var(--ha-control-ink-active);
	background: var(--ha-control-bg-active);
	border-color: transparent;
	border-radius: var(--ha-control-radius-primary);
`;

/* ── The beat ──────────────────────────────────────────────────────────────────────────────
 * What a control does while it waits for a hand. NEXT TURN asks for it, because that is the one
 * control the game needs a player to find rather than to look for: a turn that has ended looks
 * exactly like a turn that has not until somebody notices the button lit.
 *
 * TWO beats, then a rest — a double knock rather than a single tap, because one soft pulse was easy
 * to sit through. The pair is what makes it read as somebody asking rather than as something merely
 * lit, and the rest after it is what keeps it from reading as an alarm.
 *
 * Three directions, one mechanism, two tokens — the same arrangement as everything else here: what
 * the beat LOOKS like is `--ha-control-beat-wash` and `--ha-control-beat`, so a stamp's second
 * impression, a drawing's ferro-red callout and a brass switch catching the light are all this rule.
 *
 * IT MAY NOT MOVE THE BUTTON, and that is a constraint rather than a taste. Most of the browser
 * suite clicks `#next-turn`, and playwright will not click a target whose bounding box changed
 * between two animation frames — a rocking stamp is the obvious Dossier reading of "ready" and
 * would have hung several hundred specs on the actionability check. So the beat is opacity on a
 * pseudo-element and nothing else: the button's own box never moves, and the pseudo is inset to it,
 * clipped by its `clip-path` and rounded by its radius, so each direction's edge still holds.
 *
 * Which is also why "more insistent" is spent on the two things that cost no geometry — how OFTEN it
 * says it and how LOUD each token is — and never on a transform. A box-shadow does not enter any
 * bounding box either, but a `clip-path` direction would crop an outward glow and the other two
 * would not, so the light stays inside the control in all three.
 * ------------------------------------------------------------------------------------------- */

const beat = keyframes`
	0%   { opacity: 0; }
	5%   { opacity: 1; }
	17%  { opacity: 0.28; }
	27%  { opacity: 1; }
	48%  { opacity: 0; }
	100% { opacity: 0; }
`;

// Both beats and the rest after them. Shorter than it was, because the pair has to land as one
// gesture and then leave a silence long enough to be a silence.
const BEAT_MS = 1900;

const beats = css`
	position: relative;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
		background: var(--ha-control-beat-wash);
		box-shadow: var(--ha-control-beat);
		animation: ${beat} ${BEAT_MS}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	/* The beat is done the moment the pointer arrives — it was only ever asking for one. */
	&:hover::after,
	&:active::after,
	&:focus-visible::after {
		animation: none;
		opacity: 0;
	}

	/* Asked for less movement, the control still has to say it is ready, so it says it once and
	   holds it rather than saying nothing at all. Held higher than it was, for the same reason the
	   beat is louder: this is the one control the game needs a player to find. */
	@media (prefers-reduced-motion: reduce) {
		&::after {
			animation: none;
			opacity: 0.8;
		}
	}
`;

const onActive = ({ active, $primary, $beat }) => {
	if (active) {
		return css`
			color: var(--ha-control-ink);
			background: var(--ha-control-bg);
			border: var(--ha-control-edge);
			text-shadow: var(--ha-control-ink-shadow);
			box-shadow: var(--ha-control-shadow);
			/* Dossier stamps sit slightly crooked; the other two are square, and say so with a
			   rotation of zero rather than by not having the rule. */
			transform: rotate(var(--ha-control-rotate));
			transition:
				transform 0.1s ease-out,
				box-shadow 0.1s ease-out,
				background 0.1s ease-out;

			&:hover {
				transform: rotate(0deg) scale(1.03);
				box-shadow: var(--ha-control-shadow-hover);
			}

			/* A stamp presses, a brass switch sinks. Same gesture, and the skin decides how far it
			   reads. */
			&:active {
				transform: rotate(0deg) scale(0.97);
				background: var(--ha-accent-wash);
			}

			@media (prefers-reduced-motion: reduce) {
				&,
				&:hover,
				&:active {
					transform: none;
					transition: none;
				}
			}

			${$primary && asPrimary}
			${$beat && beats}
		`;
	}

	return css`
		color: var(--ha-control-ink-off);
		background: var(--ha-control-bg-off);
		border: var(--ha-control-edge-off);
	`;
};

// `disabled` as well as dimmed, which it was not before. Every handler in the app already guards on
// the same flag, so nothing about what a click does changes — what changes is that a control nobody
// can use is skipped by the keyboard and announced as unavailable rather than merely looking quiet.
export const Button = styled.button.attrs(({ active }) => ({ disabled: !active }))`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 17px;
	letter-spacing: var(--ha-track);
	text-transform: uppercase;
	padding: 5px 10px;
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};

	${size}
	${onActive}

  &,
  &:focus,
  &:active {
		outline: none;
	}

	/* A control has to be reachable from the keyboard, and the accent is the one colour every skin
	   has that is guaranteed to sit on its own ground. */
	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`;

// A row of controls, centred. Flex with a gap rather than `text-align: center`, because it has to hold
// two now — START beside LEAVE ROOM, READY beside LEAVE — and each skin gives a control an edge of its
// own, a stamp outline or a bevel, so without air between them they share one. Dossier's stamps sit
// slightly rotated, which had them overlapping outright.
export const Buttons = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	align-items: center;
	justify-content: center;
	text-align: center;
`;
