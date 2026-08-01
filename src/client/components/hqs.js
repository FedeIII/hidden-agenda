import styled from 'styled-components';
import { narrow } from './breakpoints';

const HQs = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 25%;
	max-width: 230px;
	flex-shrink: 0;

	/* Stacked layout: the pair sits side by side above (and below) the board rather than as a
	   tall column beside it. */
	${narrow} {
		flex-direction: row;
		width: 100%;
		max-width: none;
		gap: 8px;
	}
`;

export default HQs;
