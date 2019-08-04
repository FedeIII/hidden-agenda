import React from 'react';
import pz from 'Shared/pz';
import PieceStyled from './styled';

function Piece({ id, selectedDirection, selected, onClick }) {
  const team = pz.getTeam(id);
  const type = pz.getType(id);
  const image = `img/${team}-${type}.png`;

  return (
    <PieceStyled
      src={image}
      pieceId={id}
      selectedDirection={selectedDirection}
      onClick={() => onClick(id)}
    />
  );
}

export default Piece;
