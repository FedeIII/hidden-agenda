import styled, { css } from 'styled-components';
import { narrow, narrowOrShort } from 'Client/components/breakpoints';
import { TEAM_COLORS } from 'Domain/teams';

export const EndPhaseContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	padding: 10px 40px 60px;
	margin-top: 40px;
	align-items: center;

	/* Was a fixed three-across row, so on a phone the two team columns were simply off-screen. */
	${narrow} {
		flex-direction: column;
		align-items: stretch;
		padding: 8px;
		margin-top: 8px;
		gap: 10px;
	}
`;

export const Score = styled.div`
	text-align: center;
	font-size: 50px;
	padding: 15px;

	${narrowOrShort} {
		font-size: 30px;
		padding: 6px;
	}
`;

export const Points = styled.sup`
	font-size: 16px;
`;

export const PieceCountContainer = styled.div`
	margin-bottom: 8px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const PieceCountTitle = styled.span`
	display: inline-block;
	margin-bottom: 8px;
`;

export const PieceTable = styled.div`
	background-color: lightslategray;
	border: 2px solid gray;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 10px 8px;
	margin-bottom: 12px;

	${narrowOrShort} {
		flex-direction: row;
		padding: 8px;
		margin-bottom: 10px;
	}
`;

export const PieceRow = styled.div`
	letter-spacing: -3px;
	display: flex;
	align-items: end;
	justify-content: space-evenly;
	margin: 0 0 8px;
`;

const pointsColor = ({ team }) => TEAM_COLORS[team] || 'white';

export const PieceCell = styled.span`
	display: flex;
	color: ${pointsColor};
	flex-flow: column;
	align-items: center;
	flex-basis: 33%;
	justify-content: space-evenly;
	font-size: 18px;
	font-weight: bold;
	flex-shrink: ${({ big }) => (big ? '0' : 'initial')};
`;

export const Scores = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 46%;
	min-width: 0;
	flex-shrink: 0;
	max-height: 100%;

	${narrow} {
		width: 100%;
		order: -1;
	}
`;

export const PointsTable = styled.div`
	background-color: lightslategray;
	border: 2px solid gray;
	padding: 12px 10px;
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;

	${narrowOrShort} {
		padding: 8px 6px;
		margin-bottom: 10px;
	}
`;

export const Winner = styled.div`
	color: white;
	align-self: center;
	margin: 30px auto 10px;
	font-size: 18px;
	font-weight: bold;
`;

export const PlayerWinner = styled.div`
	color: white;
	align-self: center;
	font-size: 32px;
	font-weight: bold;
`;

/* ---------------------------------------------------------------------------------------------
 * Score breakdown.
 *
 * The old version put every term of the formula in its own narrow table cell, so the signs wrapped
 * onto a line of their own ("+" sitting above "135") and nothing said which team a number came
 * from. It was arithmetic you had to reverse-engineer.
 *
 * This lays each player out as the equation it actually is, left to right, and borrows the
 * friend/foe cards the game already uses everywhere else — green for friend, red for foe, with the
 * team's own colour inside. So a number's origin is carried by the card next to it rather than by
 * a caption, and the reveal cost sits inside the same bordered group as the alignment it was paid
 * for, which is the only thing about the formula that was genuinely ambiguous.
 * ------------------------------------------------------------------------------------------- */

export const ScoreList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const ScoreRow = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 10px;
	padding: 5px 2px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.14);

	&:last-of-type {
		border-bottom: none;
	}
`;

/* The player's terms, stacked so each alignment gets a full line. Cramming the whole equation
   onto one line is what forced the numbers into boxes too narrow to hold them. */
export const Breakdown = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
`;

export const BreakdownHead = styled.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
`;

export const PlayerName = styled.div`
	color: white;
	font-weight: bold;
	font-size: 15px;
	letter-spacing: 0;
	white-space: nowrap;
`;

export const Base = styled.div`
	color: white;
	font-size: 15px;
	font-weight: bold;
	letter-spacing: 0;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
	opacity: 0.8;
`;

const groupTint = ({ alignment }) =>
	alignment === 'friend'
		? css`
				border-color: mediumseagreen;
			`
		: css`
				border-color: indianred;
			`;

export const AlignmentGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	padding: 2px 8px;
	border: 2px solid;
	border-radius: 3px;
	${groupTint}
`;

/* Same colours as the alignment cards dealt at the start of the game: the green/red frame says
   friend or foe, the chip inside says which team. */
export const AlignmentPill = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 62px;
	padding: 1px 5px;
	font-size: 11px;
	font-weight: bold;
	letter-spacing: 0;
	background-color: ${({ team }) => TEAM_COLORS[team]};
	color: ${({ team }) => (team === '2' || team === '3' ? 'black' : 'white')};
	border: 1px solid rgba(0, 0, 0, 0.35);
`;

export const Amount = styled.span`
	font-size: 15px;
	font-weight: bold;
	letter-spacing: 0;
	font-variant-numeric: tabular-nums;
	color: white;
	margin-left: auto;
	/* Without this "+ 135" breaks at the space and the sign lands on its own line above the
	   number, which is exactly what made the old table unreadable. */
	white-space: nowrap;

	${narrow} {
		margin-left: 0;
	}
`;

/* The reveal cost lives inside its alignment's group, so which of the two it was paid for is not
   something the reader has to work out. */
export const RevealCost = styled.span`
	font-size: 13px;
	font-weight: bold;
	letter-spacing: 0;
	font-variant-numeric: tabular-nums;
	color: #ffd479;
	padding-left: 6px;
	border-left: 1px dashed rgba(255, 255, 255, 0.35);
	white-space: nowrap;
`;

export const Total = styled.div`
	color: white;
	font-size: 26px;
	font-weight: bold;
	letter-spacing: 0;
	text-align: right;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
	min-width: 56px;
`;
