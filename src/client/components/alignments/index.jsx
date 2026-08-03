import { AlignmentCardStyled, AlignmentLabel, AlignmentTeam } from './components';
export { Alignments } from './components';

const WORD = { friend: 'Friend', foe: 'Foe' };

// A card says which of the two it is, in words.
//
// Green and red have carried that on their own since the first version, and colour alone is a poor
// way to say something this important: it is the difference between a team you want to win and one
// you want dead, it is being read across a table, and a player meeting the game for the first time
// has no reason to know which way round the two hues go.
//
// `data-team` carries the team INDEX, which is what a spec actually wants. Reading the team off the
// card's innerText meant round-tripping through a display string, and the moment the card had a
// second word in it that broke — see the helper in tests/helpers/navigation.js.
function AlignmentCard(props) {
	const { children, team, small, alignment } = props;

	return (
		<AlignmentCardStyled {...props}>
			<AlignmentLabel small={small}>{WORD[alignment]}</AlignmentLabel>
			{children && (
				<AlignmentTeam small={small} team={team} data-team={team}>
					{children}
				</AlignmentTeam>
			)}
		</AlignmentCardStyled>
	);
}

export function AlignmentFriend(props) {
	return <AlignmentCard alignment="friend" {...props} />;
}

export function AlignmentFoe(props) {
	return <AlignmentCard alignment="foe" {...props} />;
}
