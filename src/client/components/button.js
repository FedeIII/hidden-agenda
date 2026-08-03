import styled, { css } from 'styled-components';

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

const onActive = ({ active, $primary }) => {
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

export const Buttons = styled.div`
	text-align: center;
`;
