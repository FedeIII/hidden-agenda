import React, {PropTypes} from 'react';

import PieceContainer from 'containers/pieceContainer';

function renderPieces (pieces) {
    return pieces.map(piece =>
        <PieceContainer
            key={piece.id}
            {...piece}
        />
    );
}

function Hq ({
    team,
    pieces
}) {

    const className = `hq hq-${team}`;
    const Pieces = renderPieces(pieces);

    return (
        <div key={`team${team}`} className={className}>
            <div className="hq__store">
                {Pieces}
            </div>
        </div>
    );
}

// Hq.propTypes = {
//     team: PropTypes.string.isRequired,
//     pieces: PropTypes.object
// };

export default Hq;
