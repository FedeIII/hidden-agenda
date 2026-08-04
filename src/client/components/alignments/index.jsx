import { TEAM_NAMES } from 'Domain/teams';
import {
	AlignmentCardStyled,
	AlignmentLabel,
	AlignmentBody,
	AlignmentTeam,
	AlignmentSwatch,
	AlignmentChip,
	AlignmentSwatchLabel,
	AlignmentSwatchRef,
	AlignmentSwatchName,
	AlignmentFoot,
} from './components';
export { Alignments } from './components';

const WORD = { friend: 'Friend', foe: 'Foe' };

// What the alignment does to your score, which is the whole of what friend and foe mean and the one
// thing about them nobody can infer from green and red. `py.getPoints` adds the friend team's points
// and subtracts the foe team's; the card says so in the words the table would use.
const NOTE = { friend: 'their points are yours', foe: 'their points come off yours' };

// A card says which of the two it is, in words.
//
// Green and red have carried that on their own since the first version, and colour alone is a poor
// way to say something this important: it is the difference between a team you want to win and one
// you want dead, it is being read across a table, and a player meeting the game for the first time
// has no reason to know which way round the two hues go.
//
// `data-team` carries the team INDEX, which is what a spec actually wants, and exactly one element per
// card carries it — the swatch names the same team but takes it as a prop, so `[data-team]` stays
// unique under a card and a spec's strict-mode locator keeps resolving. Reading the team off the
// card's innerText meant round-tripping through a display string, and the moment the card had a second
// word in it that broke — see the helper in tests/helpers/navigation.js.
function AlignmentCard(props) {
	const { children, team, alignment } = props;
	const named = !!children && team !== undefined && team !== null;

	return (
		<AlignmentCardStyled {...props}>
			<AlignmentLabel alignment={alignment}>{WORD[alignment]}</AlignmentLabel>

			{named && (
				<AlignmentBody>
					<AlignmentTeam team={team} data-team={team}>
						{children}
					</AlignmentTeam>
					<AlignmentSwatch>
						<AlignmentChip team={team} />
						<AlignmentSwatchLabel>
							<AlignmentSwatchRef>team {team}</AlignmentSwatchRef>
							<AlignmentSwatchName>{TEAM_NAMES[team]}</AlignmentSwatchName>
						</AlignmentSwatchLabel>
					</AlignmentSwatch>
				</AlignmentBody>
			)}

			<AlignmentFoot>{NOTE[alignment]}</AlignmentFoot>
		</AlignmentCardStyled>
	);
}

export function AlignmentFriend(props) {
	return <AlignmentCard alignment="friend" {...props} />;
}

export function AlignmentFoe(props) {
	return <AlignmentCard alignment="foe" {...props} />;
}
