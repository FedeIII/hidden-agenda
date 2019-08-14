import React from 'react';
import { AlignmentCardStyled, AlignmentTeam } from './components';

function AlignmentCard(props) {
  const { children, team } = props;
  return (
    <AlignmentCardStyled {...props}>
      <AlignmentTeam team={team}>{children}</AlignmentTeam>
    </AlignmentCardStyled>
  );
}

export function AlignmentFriend(props) {
  return <AlignmentCard alignment="friend" {...props} />;
}

export function AlignmentFoe(props) {
  return <AlignmentCard alignment="foe" {...props} />;
}
