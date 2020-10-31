import React, { useContext, useCallback } from 'react';
import { pz } from 'Domain/pieces';
import { StateContext } from 'State';
import { togglePiece } from 'Client/actions';
import PieceStyled from 'Client/components/pieceStyled';

function Piece({ id, selectedDirection, selected, highlight }) {
  const team = pz.getTeam(id);
  const type = pz.getType(id);
  const image = `img/${team}-${type}.png`;

  const [state, dispatch] = useContext(StateContext);

  const onClick = useCallback(() => dispatch(togglePiece(id)), [dispatch, id]);

  return (
    <PieceStyled
      src={image}
      pieceId={id}
      selected={selected}
      highlight={highlight}
      selectedDirection={selectedDirection}
      onClick={onClick}
    />
  );
}

export default Piece;
