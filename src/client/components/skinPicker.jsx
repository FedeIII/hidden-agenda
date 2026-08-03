import styled from 'styled-components';
import { SKIN_NAMES } from 'Domain/skins';
import { narrowOrShort } from './breakpoints';
import useSkin, { useCanChangeSkin, useSetSkin } from 'Hooks/useSkin';

// Three named options rather than a cycle button, because the point is choosing a direction and a
// cycle makes you visit the two you did not want. The current one is filled in the accent, which is
// the one colour every skin has that is guaranteed to sit on its own ground.
//
// It renders nothing at all when the viewer may not change the skin — a non-host seat, or anybody
// once the game has started. The server refuses the message in those cases too; this only stops the
// UI inviting somebody to do something that will be turned down.

const Picker = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	flex-wrap: wrap;
	padding: 6px 0 2px;
`;

const Label = styled.span`
	font-family: var(--ha-face-data);
	font-size: 10px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`;

const Options = styled.div`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
	justify-content: center;
`;

const Option = styled.button`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	padding: 4px 10px;
	cursor: pointer;
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	/* A border of the same width whether or not this is the current option, so choosing one does not
	   nudge the other two sideways. Colour carries the state; width never does. */
	border: 1px solid ${({ current }) => (current ? 'var(--ha-accent)' : 'var(--ha-rule)')};
	background: ${({ current }) => (current ? 'var(--ha-accent)' : 'transparent')};
	color: ${({ current }) => (current ? 'var(--ha-ink-on-accent)' : 'var(--ha-ink-dim)')};

	&:hover {
		color: ${({ current }) => (current ? 'var(--ha-ink-on-accent)' : 'var(--ha-ink)')};
		border-color: var(--ha-accent);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}

	${narrowOrShort} {
		font-size: 10px;
		letter-spacing: 0.06em;
		padding: 4px 7px;
	}
`;

function SkinPicker() {
	const skin = useSkin();
	const canChange = useCanChangeSkin();
	const setSkin = useSetSkin();

	if (!canChange) {
		return null;
	}

	return (
		<Picker id="skin-picker">
			<Label>Style</Label>
			<Options>
				{SKIN_NAMES.map(name => (
					<Option
						key={name}
						id={`skin-option-${name}`}
						type="button"
						current={name === skin}
						aria-pressed={name === skin}
						onClick={() => setSkin(name)}
					>
						{name}
					</Option>
				))}
			</Options>
		</Picker>
	);
}

export default SkinPicker;
