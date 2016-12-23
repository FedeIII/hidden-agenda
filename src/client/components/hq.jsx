import React from 'react';

function Hq(props) {
    const className = `hq hq-${props.team}`;
    return (
        <div key={`team${props.team}`} className={className}>
            <div className="hq__store">
                {/* <img src="img/hexgrid.png" /> */}
            </div>
        </div>
    );
}

export default Hq;
