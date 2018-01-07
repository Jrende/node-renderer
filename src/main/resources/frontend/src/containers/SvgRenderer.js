import { connect } from 'react-redux';
import SvgRenderer from '../components/svg/SvgRenderer';
import * as actions from '../actions';

/*
function getConnections(graph) {
  let ret = [];
  graph.forEach(node => {
    if(node.input != null) {
      Object.keys(node.input).forEach(key => {
        ret.push({
          from: {
            id: node.id,
            name: key
          },
          to: {
            id: node.input[key].node.id,
            name: node.input[key].name
          }
        });
      });
    }
  });
  return ret;
}
*/

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
