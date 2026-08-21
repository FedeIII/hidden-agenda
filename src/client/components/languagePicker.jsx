import styled from 'styled-components';
import useT, { LANGS, useLang, useSetLang } from 'Client/i18n';
import { narrowOrShort } from './breakpoints';

// Which language the file is written in, asked the way a file would ask it.
//
// Not a third row of stamped buttons, and not the skin picker with different words in it. Every
// other control in this game is something you press — a rubber stamp, a chalked box, a brass switch.
// This one is a **field on a form**: a typed key, two boxes, and an ✕ struck into one of them. That
// is the one gesture a paper dossier has that nothing else in the interface uses yet, and it says
// what the control does before the words do — a form declares its own language at the top, and you
// tick the box.
//
// The details that make it read as typed rather than as a checkbox widget:
//
// - The ✕ is a glyph, set larger than its box and rotated a degree or two, so it sits proud of the
//   rule the way a hand-struck mark does instead of centring neatly inside it.
// - The chosen code is underlined in the accent — the same red-pencil underline the HQ card draws
//   under the name of whoever holds a team (`--ha-claim-holder-rule`).
// - The key is `--ha-face-data` at nine pixels with the label tracking, which is what every other
//   caption on a form in this game is set in.
//
// It is dressed in tokens rather than in Dossier's literal colours, so the other two directions get
// their own reading of the same object for free: a drawing's ruled field with a chalk cross, a
// case's milled recess with the mark in brass. `--ha-field-*` is the form-field token trio the name
// and code inputs already use, so the box is made of the same material as the fields beside it.
//
// It renders wherever a player is still setting things up — the lobby, the hot-seat form, the
// alignment cards — and never over the board. The board's hexagons are transparent DOM elements and
// anything laid over them eats the clicks; a language is also not a decision anybody needs mid-turn.

const Slip = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 10px;
	flex-wrap: wrap;
	padding: 2px 0;
`;

const Key = styled.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);

	/* A typed key is followed by its rule. Two ways of saying "what goes here", and a form says
	   both. */
	&::after {
		content: ' ·';
	}
`;

const Boxes = styled.div`
	display: flex;
	align-items: baseline;
	gap: 12px;

	${narrowOrShort} {
		gap: 9px;
	}
`;

const Choice = styled.button`
	display: inline-flex;
	align-items: baseline;
	gap: 5px;
	padding: 0;
	border: none;
	background: none;
	cursor: pointer;
	font-family: var(--ha-face-data);
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: ${({ $current }) => ($current ? 'var(--ha-ink)' : 'var(--ha-ink-faint)')};

	/* The red-pencil underline, and only under the code — the box keeps its own edge. A literal
	   width either way rather than none at all: a rule that appeared on selection would move the two
	   codes apart by a pixel, which is the same reason the title tokens are transparent rather than
	   absent. See theme/tokens.js. */
	& > span:last-child {
		border-bottom: 1px solid ${({ $current }) => ($current ? 'var(--ha-accent)' : 'transparent')};
	}

	&:hover {
		color: var(--ha-ink);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 3px;
	}
`;

// The box itself: an empty square on the form, and the mark is drawn over it rather than inside it.
const Box = styled.span`
	position: relative;
	display: inline-block;
	width: 11px;
	height: 11px;
	flex-shrink: 0;
	background: var(--ha-field-bg);
	/* The token is a whole border shorthand, the way the name and code inputs read it. */
	border: var(--ha-field-edge);
	/* A box on a form sits on the baseline of the line it is typed on, not above it. */
	vertical-align: baseline;
	transform: translateY(1px);

	&::after {
		content: '✕';
		position: absolute;
		/* Bigger than the box and off-centre by a hair, which is what a struck mark looks like. */
		inset: -4px -3px;
		display: ${({ $current }) => ($current ? 'flex' : 'none')};
		align-items: center;
		justify-content: center;
		font-family: var(--ha-face-data);
		font-size: 14px;
		line-height: 1;
		color: var(--ha-accent);
		transform: rotate(-4deg);
	}
`;

function LanguagePicker({ id = 'language-picker' }) {
	const t = useT();
	const lang = useLang();
	const setLang = useSetLang();

	return (
		<Slip id={id}>
			<Key>{t('language.label')}</Key>
			<Boxes>
				{LANGS.map(name => (
					<Choice
						key={name}
						id={`language-option-${name}`}
						type="button"
						$current={name === lang}
						aria-pressed={name === lang}
						/* The full name, in its own language, for anyone who is being read this rather
						   than looking at it — `EN` alone is two letters that say nothing out loud. */
						aria-label={t(`language.name.${name}`)}
						title={t(`language.name.${name}`)}
						onClick={() => setLang(name)}
					>
						<Box $current={name === lang} aria-hidden="true" />
						<span>{t(`language.short.${name}`)}</span>
					</Choice>
				))}
			</Boxes>
		</Slip>
	);
}

export default LanguagePicker;
