import styled from 'styled-components';

export const StartPhaseContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 960px;
  width: 66vw;
`;

export const Options = styled.div`
  width: 100%;
  background-color: antiquewhite;
  margin-bottom: 25px;
`;

export const NumberPlayers = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`;

export const MainTitle = styled.div`
  color: antiquewhite;
  background-color: black;
  padding: 5px 10px;
`;

export const Title = styled.div`
  font-size: 10px;
  padding: 5px 10px;
`;

export const NumberPlayersOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 20px;
  padding: 15px;
`;

export const NumberPlayersOptionLabel = styled.label`
  margin-left: 5px;
`;

export const Players = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Player = styled.div`
  border: 1px solid black;
  flex-basis: 33%;
  flex-grow: 1;
`;

export const PlayerNameInput = styled.input`
  margin: 5px 5px 10px 10px;
  padding: 5px 5px 2px 5px;
  background: antiquewhite;
  font-size: 20px;
  position: relative;
  text-transform: uppercase;
  width: 75%;

  &,
  &:focus,
  &:active {
    border: none;
    border-bottom: 1px solid black;
    outline: none;
    font-family: monospace;
    letter-spacing: 5px;
  }
`;
