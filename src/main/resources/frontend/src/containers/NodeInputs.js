import { connect } from 'react-redux';
import NodeInputs from '../components/NodeInputs';
import * as actions from '../actions';

const Component = connect(
  undefined,
  (dispatch) => ({
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    }
  })
)(NodeInputs);

export default Component;
