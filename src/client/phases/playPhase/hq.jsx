import React, { useContext } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { claimControl } from 'Client/actions';
import HqStyled from 'Client/components/hqStyled';
import { Cementery } from 'Client/components/pieceCount';
import { HqStore, HqButton, HqMessage } from './components';
import Piece from './piece/index';

function getNotStartedTeamPieces(pieces, team) {
	return pz.getAllTeamPieces(team, pieces).filter(piece => !piece.position);
}

function HQ({ team }) {
	const [{ pieces, players, teamControl }, dispatch] = useContext(StateContext);

	const playerName = teamControl[team].player;
	const playerTurn = py.getTurn(players);
	const onClaim = () => dispatch(claimControl(playerTurn, team));

	return (
		<HqStyled key={`team${team}`} team={team}>
			<HqButton active small onClick={onClaim}>
				Claim Control
			</HqButton>
			{playerName && <HqMessage>Controled by: {playerName}</HqMessage>}
			<HqStore id={`store-${team}`}>
				{getNotStartedTeamPieces(pieces, team).map(piece => (
					<Piece key={piece.id} {...piece} />
				))}
			</HqStore>
			<Cementery team={team} />
		</HqStyled>
	);
}

export default HQ;
