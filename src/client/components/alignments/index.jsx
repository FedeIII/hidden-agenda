import React from 'react';
import { AlignmentCardStyled, AlignmentTeam } from './components';
export { Alignments } from './components';

function AlignmentCard(props) {
  const { children, team, small } = props;
  return (
    <AlignmentCardStyled {...props}>
      {children && <AlignmentTeam small={small} team={team}>{children}</AlignmentTeam>}
    </AlignmentCardStyled>
  );
}

export function AlignmentFriend(props) {
  return <AlignmentCard alignment="friend" {...props} />;
}

export function AlignmentFoe(props) {
  return <AlignmentCard alignment="foe" {...props} />;
}
