import styled, { css } from 'styled-components';
import { pz } from 'Domain/pieces';
import { directionToAngle } from 'Client/three/layout';

const brightness = ({ pieceId = '' }) => {
	if (pz.getTeam(pieceId) === '2') {
		return css`
			filter: brightness(1.2);
		`;
	}
};

// The six bearings used to live here as a table of rotate() values, and again in the 3D layer as
// a table of angles. Two tables that must agree and nothing to make them: if they ever drifted,
// a piece would point one way flat and another way in 3D, and nothing would fail — the suite
// asserts this matrix, which would still be right. So there is one table now, and it is the one
// the renderer turns tokens by.
const withDirection = ({ selectedDirection }) => {
	if (selectedDirection) {
		return css`
			transform: rotate(${directionToAngle(selectedDirection)}deg);
		`;
	}
};

const inHQ = ({ selectedDirection }) => {
	if (!selectedDirection) {
		return css`
			width: 20%;
			margin: 0;
		`;
	}
};

const positionInHQ = ({ selectedDirection, pieceId }) => {
	if (!selectedDirection && pieceId) {
		const type = pz.getType(pieceId);
		const pieceNumber = pz.getNumber(pieceId);

		switch (`${type}${pieceNumber}`) {
			case 'A1':
				return css`
					top: 44%;
					left: 3%;
				`;
			case 'A2':
				return css`
					top: 24.5%;
					left: 21.5%;
				`;
			case 'A3':
				return css`
					top: 6%;
					left: 40%;
				`;
			case 'A4':
				return css`
					top: 24.5%;
					left: 58%;
				`;
			case 'A5':
				return css`
					top: 44%;
					left: 76.5%;
				`;
			case 'C':
				return css`
					top: 44%;
					left: 40%;
				`;
			case 'S':
				return css`
					top: 63.5%;
					left: 21.5%;
				`;
			case 'N':
				return css`
					top: 63.5%;
					left: 58%;
				`;
		}
	}
};

const inCementery = ({ killed }) => {
	if (killed) {
		return css`
			position: relative;
			top: 0;
			left: 0;
			width: 50%;
			margin-right: 2px;
		`;
	}
};

const onSelected = ({ selected, highlight }) => {
	if (selected || highlight) {
		return css`
			filter: brightness(2);

			&:hover {
				filter: brightness(2);
			}
		`;
	}
};

// In 3D the piece is drawn by the renderer and this <img> becomes its hit box: laid over the
// token, invisible, and still the thing that is clicked, dragged, hovered and asserted against.
//
// Positioned with top and left, never with a transform — the transform is the piece's facing, and
// it is read back as a matrix to check which way a piece is pointing. A translate in there would
// change every one of those matrices at once.
//
// Width AND height are both set, where the flat renderer sets only width and lets the PNG's
// aspect supply the rest. That is not tidying: a piece whose image has not decoded yet has no
// height at all, and a box with no height cannot be clicked or dragged from.
const onProjected = ({ projected }) => {
	if (projected) {
		return css`
			position: absolute;
			right: auto;
			bottom: auto;
			margin: 0;
			opacity: 0;
			/* Not "all". The box itself is set from the projection, and a projection changes when
			   the window does — a phone rotating, a URL bar collapsing. Transitioning that would
			   animate the hit box, which is the one thing it must never do. */
			transition: filter 0.2s ease-in-out;
		`;
	}
};

const PieceStyled = styled.img`
	position: absolute;
	/* touch-action: without it a touch drag scrolls the page instead of emitting pointermove,
	   so pieces cannot be dragged on a phone. user-drag stops the browser's own image drag. */
	touch-action: none;
	-webkit-user-drag: none;
	user-select: none;
	width: 92%;
	top: -43%;
	bottom: 0;
	left: -6%;
	right: 0;
	margin-left: 10%;
	margin-top: 13%;
	z-index: 2;
	cursor: pointer;
	transition: all 0.2s ease-in-out;

	&:hover {
		filter: brightness(1.5);
	}

	${brightness}
	${withDirection}
	${inHQ}
	${positionInHQ}
	${inCementery}
	${onSelected}
	${onProjected}
`;

export default PieceStyled;
