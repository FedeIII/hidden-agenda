import React, {PropTypes} from 'react';

import PieceContainer from 'containers/pieceContainer';

function renderPieces (pieces) {
    return pieces.map(piece =>
        <PieceContainer
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

// class Hq extends React.Component {
//     renderPieces() {
//         const pieces = [];
//         for (let pieceName in this.props.pieces) {
//             const piece = this.props.pieces[pieceName];
//             const PieceComponent = <Piece
//                                         direction={piece.direction}
//                                         // selected={this.props.isPieceSelected}
//                                         selectPiece={() => this.props.selectPiece(piece)}
//                                         deselectPiece={() => this.props.deselectPiece()}
//                                     />
//             pieces.push(PieceComponent);
//         }
//
//         return pieces;
//     }
//
//     render() {
//         const className = `hq hq-${this.props.team}`;
//         const pieces = this.renderPieces();
//
//         return (
//             <div key={`team${this.props.team}`} className={className}>
//                 <div className="hq__store">
//                     {pieces}
//                 </div>
//             </div>
//         );
//     }
// }

export default Hq;
