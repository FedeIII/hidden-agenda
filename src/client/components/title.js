import styled from 'styled-components';
import { narrowOrShort } from './breakpoints';

export const Title = styled.div`
	padding: 20px;
	text-align: center;
	color: white;
	font-weight: bold;
	font-size: 16px;
	width: 90vw;

	${narrowOrShort} {
		padding: 8px 4px;
		font-size: 13px;
		width: 100%;
	}
`;

export const Subtitle = styled.div`
	padding: 20px;
	text-align: center;
	color: white;
	font-size: 16px;

	${narrowOrShort} {
		padding: 8px 4px;
		font-size: 13px;
	}
`;
