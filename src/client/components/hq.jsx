import React from 'react';

function Hq(props) {
    const className = `hq hq-${props.team}`;
    return (
        <div className={className}></div>
    );
}

export default Hq;
