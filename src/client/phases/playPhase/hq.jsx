import { useCallback, useContext, useMemo, useRef } from 'react';
import { StateContext } from 'State';
import { pz } from 'Domain/pieces';
import py from 'Domain/py';
import { claimControl, cancelControl } from 'Game/actions';
import HqStyled from 'Client/components/hqStyled';
import { Cementery } from 'Client/components/pieceCount';
import createHqScene from 'Client/three/hqScene';
import { slotKeyForPiece } from 'Client/three/layout';
import useThreeView from 'Client/three/useThreeView';
import { HqStore, HqButton, HqMessage } from './components';
import Piece from './piece/index';

function getNotStartedTeamPieces(pieces, team) {
	return pz.getAllTeamPieces(team, pieces).filter(piece => !piece.position);
}

function HQ({ team }) {
	const [{ pieces, players, teamControl }, dispatch] = useContext(StateContext);
	const storeRef = useRef(null);

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

	const stored = useMemo(() => getNotStartedTeamPieces(pieces, team), [pieces, team]);

	const createScene = useCallback(element => createHqScene(team, element), [team]);
	const scene = useMemo(() => ({ pieces: stored }), [stored]);
	const layout = useThreeView(storeRef, createScene, scene);

	return (
		<HqStyled key={`team${team}`} team={team} dimensional={!!layout}>
			<HqButton id={`claim-${team}`} active={claimEnabled} small onClick={onClaimClick}>
				{isClaimingControl ? 'Cancel' : 'Claim Control'}
			</HqButton>
			{hasControl && <HqMessage id={`controlled-${team}`}>Controlled by: {prevPlayerName || playerName}</HqMessage>}
			<HqStore id={`store-${team}`} ref={storeRef} dimensional={!!layout}>
				{stored.map(piece => (
					<Piece key={piece.id} {...piece} box={layout && layout[slotKeyForPiece(piece.id)]} />
				))}
			</HqStore>
			<Cementery team={team} dimensional={!!layout} />
		</HqStyled>
	);
}

export default HQ;
