import React, { useContext, useCallback } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { claimControl, cancelControl } from 'Client/actions';
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
	const prevPlayerName = teamControl[team].prevPlayer;
	const claimEnabled = teamControl[team].claimEnabled;
	const controlling = teamControl[team].controlling;
	const playerTurn = py.getTurn(players);

	const isClaimingControl = (playerName && !controlling) || !!prevPlayerName;
	const hasControl = (playerName || prevPlayerName) && controlling;

	const onClaimClick = useCallback(() => {
		if (isClaimingControl) {
			dispatch(cancelControl(team));
		} else if (claimEnabled) {
			dispatch(claimControl(playerTurn, team));
		}
	}, [isClaimingControl, claimEnabled, dispatch, team, playerTurn]);

	return (
		<HqStyled key={`team${team}`} team={team}>
			<HqButton id={`claim-${team}`} active={claimEnabled} small onClick={onClaimClick}>
				{isClaimingControl ? 'Cancel' : 'Claim Control'}
			</HqButton>
			{hasControl && <HqMessage id={`controlled-${team}`}>Controlled by: {prevPlayerName || playerName}</HqMessage>}
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
