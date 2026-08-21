import useT from 'Client/i18n';
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
	const t = useT();
	const { children, team, alignment } = props;
	const named = !!children && team !== undefined && team !== null;

	return (
		<AlignmentCardStyled {...props}>
			<AlignmentLabel alignment={alignment}>{t(`alignment.${alignment}.card`)}</AlignmentLabel>

			{named && (
				<AlignmentBody>
					<AlignmentTeam team={team} data-team={team}>
						{children}
					</AlignmentTeam>
					<AlignmentSwatch>
						<AlignmentChip team={team} />
						<AlignmentSwatchLabel>
							<AlignmentSwatchRef>{t('play.teamRef', { team })}</AlignmentSwatchRef>
							<AlignmentSwatchName>{t(`team.${team}`)}</AlignmentSwatchName>
						</AlignmentSwatchLabel>
					</AlignmentSwatch>
				</AlignmentBody>
			)}

			{/* What the alignment does to your score, which is the whole of what friend and foe mean and
			    the one thing about them nobody can infer from green and red. `py.getPoints` adds the
			    friend team's points and subtracts the foe team's; the card says so in the words the
			    table would use. */}
			<AlignmentFoot>{t(`alignment.${alignment}.note`)}</AlignmentFoot>
		</AlignmentCardStyled>
	);
}

export function AlignmentFriend(props) {
	return <AlignmentCard alignment="friend" {...props} />;
}

export function AlignmentFoe(props) {
	return <AlignmentCard alignment="foe" {...props} />;
}
