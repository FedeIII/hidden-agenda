import React from 'react';

function HQ({ team }) {
  // const pieces = useContext(Context.Pieces);

  const className = `play-phase__hq play-phase__hq-${team}`;
  // const Pieces = renderPieces(pieces);

  return (
    <div key={`team${team}`} className={className}>
      <div className="play-phase__hq-store">{/* {Pieces} */}</div>
    </div>
  );
}

export default HQ;
