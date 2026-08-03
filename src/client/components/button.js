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

const onActive = ({ active }) => {
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
		`;
	}

	return css`
		color: var(--ha-control-ink-off);
		background: var(--ha-control-bg-off);
		border: var(--ha-control-edge-off);
	`;
};

export const Button = styled.button`
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
