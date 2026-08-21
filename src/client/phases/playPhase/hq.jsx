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
import useT from 'Client/i18n';
import { HqStore, HqFoot, HqStatement, HqClaim, HqHolder, HqLabel, HqFile } from './components';
import Piece from './piece/index';

function getNotStartedTeamPieces(pieces, team) {
	return pz.getAllTeamPieces(team, pieces).filter(piece => !piece.position);
}

function HQ({ team }) {
	const [{ pieces, players, teamControl, hasTurnEnded }, dispatch] = useContext(StateContext);
	const t = useT();
	const storeRef = useRef(null);

	const playerName = teamControl[team].player;
	const prevPlayerName = teamControl[team].prevPlayer;
	const claimEnabled = teamControl[team].claimEnabled;
	const controlling = teamControl[team].controlling;
	const playerTurn = py.getTurn(players);

	const isClaimingControl = (playerName && !controlling) || !!prevPlayerName;
	const hasControl = (playerName || prevPlayerName) && controlling;

	// Whether the claim is on offer at all, and whether it would do anything if clicked. A team can be
	// claimed only while its CEO is still in its HQ — claiming it IS deploying that CEO — which is what
	// `claimEnabled` says, and a player who has already moved cannot claim either. Both reducers refuse
	// on the same terms, so this only decides what the card shows rather than what a click is allowed
	// to do.
	const isClaimOffered = !!claimEnabled || isClaimingControl;
	const canClaim = !!claimEnabled && !hasTurnEnded;

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
			{/* Which team's HQ this is, said in words rather than left to be inferred from a frame
			    colour. Each direction reads the same element as something it already has: a file tab
			    cut into the top edge, a drawing's sheet label, a strip of embossed tape. */}
			<HqLabel id={`hq-label-${team}`}>
				{t(`team.${team}`)}
				<HqFile>{String(Number(team) + 1).padStart(2, '0')}</HqFile>
			</HqLabel>

			<HqStore id={`store-${team}`} ref={storeRef} dimensional={!!layout}>
				{stored.map(piece => (
					<Piece key={piece.id} {...piece} box={layout && layout[slotKeyForPiece(piece.id)]} />
				))}
			</HqStore>
			<Cementery team={team} dimensional={!!layout} />

			{/* Who holds the team, and what you can do about it. The words say the state — including
			    that nobody holds it, which used to be nothing on screen at all — and the control next
			    to them is the claim. A held team still offers it while its CEO is in its HQ, which is
			    the trade a reveal makes: taken at once, and takeable back off you. */}
			<HqFoot>
				<HqStatement id={`hq-control-${team}`} $held={!!hasControl} $flat={!layout}>
					{hasControl && <HqHolder id={`controlled-${team}`}>{prevPlayerName || playerName}</HqHolder>}
				</HqStatement>

				{isClaimOffered && (
					<HqClaim id={`claim-${team}`} active={canClaim} onClick={onClaimClick}>
						{t(isClaimingControl ? 'play.cancelClaim' : 'play.claim')}
					</HqClaim>
				)}
			</HqFoot>
		</HqStyled>
	);
}

export default HQ;
