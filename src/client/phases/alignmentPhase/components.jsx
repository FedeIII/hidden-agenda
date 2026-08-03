import styled from 'styled-components';

// The friend-and-foe screen, and in a hot-seat game the moment the skin is drawn: the table stops
// filling in a form and starts playing, so this is the first sheet that carries a look of its own.
//
// It is also the one panel with clean space along its top edge, which is where each direction puts
// its ornament — two punch holes on the Dossier sheet, brass rivets on the Vault plate, and nothing
// at all on a Blueprint, because a drawing is not a physical object.
export const AlignmentPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	max-width: 960px;
	width: 100%;
	background-image: var(--ha-panel-ornament);
	background-repeat: no-repeat;

	@media (max-width: 780px) {
		padding: 18px 12px;
	}
`;
