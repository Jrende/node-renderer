import { connect } from 'react-redux';
import NodeInputs from '../components/NodeInputs';
import * as actions from '../actions';

const mapStateToProps = state => (
  {
    selectedNode: state.graph.nodes[state.graph.selectedNode],
    id: state.graph.selectedNode
  }
);

const mapDispatchToProps = dispatch => (
  {
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    },
    selectNode: (nodeId) => {
      dispatch(actions.selectNode(nodeId));
    },
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeInputs);

export default Component;
