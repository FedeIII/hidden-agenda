import PlayPhase from 'components/playPhase';
import {connect} from 'react-redux';

function mapStateToProps ({players}) {
    return {
        players
    }
}

const PlayPhaseContainer = connect(
    mapStateToProps,
    null
)(PlayPhase);

export default PlayPhaseContainer;
