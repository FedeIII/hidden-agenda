import React from 'react';

import Hexagon from './hexagon';

function renderHexagon (r, h) {
    return (
        <Hexagon
            key={`${r}${h}`}
            row={r} cell={h}
            // piece={pieceInHexagon}
            // isPieceSelected={isPieceSelected}
            // highlighted={isAvailable}
            // selectPiece={(p) => this.selectPiece(p)}
            // deselectPiece={() => this.props.deselectPiece()}
            // movePiece={(r, c) => this.props.movePiece(this.props.pieceSelected, r, c)}
        />
    );
}

function renderRow (rowHexs, rowNumber) {
    const className = `hq__row hq__row--${rowNumber}`;

    return (
        <div className={className}>
            {rowHexs}
        </div>
    );
}

function renderHexagons () {
    const hexagons = [];
    const hexagonsPerRow = [3, 3, 2];

    hexagonsPerRow.forEach((numberOfHexs) => {
        const rowHexs = [];
        for (let h = 0; h < numberOfHexs; h++) {
            const hexagon = renderHexagon(rowHexs.length, h);
            rowHexs.push(hexagon);
        }

        const row = renderRow(rowHexs, hexagons.length);

        hexagons.push(row);
    });

    return hexagons;
}

function Hq(props) {
    const className = `hq hq-${props.team}`;
    return (
        <div key={`team${props.team}`} className={className}>
            <div className="hq__store">
                {renderHexagons()}
            </div>
        </div>
    );
}

export default Hq;
