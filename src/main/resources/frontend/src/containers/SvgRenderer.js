import { connect } from 'react-redux';
import SvgRenderer from '../components/svg/SvgRenderer';
import * as actions from '../actions';

const mapStateToProps = state => (
  {
    connections: state.graph.connections,
    nodes: state.graph.nodes,
    selectedNode: state.graph.selectedNode
  }
);

const mapDispatchToProps = dispatch => (
  {
    createNewNode: node => {
      dispatch(actions.createNewNode(node));
    },
    setNodeLocation: (id, pos) => {
      dispatch(actions.moveNode(id, pos));
    },
    connectNodes: (from, to) => {
      dispatch(actions.connectNodes(from, to));
    },
    removeConnection: (nodeId, connectionName) => {
      dispatch(actions.removeConnection(nodeId, connectionName));
    },
    removeNode: (nodeId) => {
      dispatch(actions.removeNode(nodeId));
    },
    selectNode: (nodeId) => {
      dispatch(actions.selectNode(nodeId));
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRenderer);

export default Component;
