import React from 'react';
import { HqStyled } from './components';

function HQ({ team }) {
  // const pieces = useContext(Context.Pieces);

  // const Pieces = renderPieces(pieces);

  return (
    <HqStyled key={`team${team}`} team={team}>
      <div className="play-phase__hq-store">{/* {Pieces} */}</div>
    </HqStyled>
  );
}

export default HQ;
