import { connect } from 'react-redux';
import RenderCanvas from '../components/RenderCanvas';
import * as actions from '../actions';

function createGraph(nodes, connections, id) {
  let graph = {
    node: nodes[id],
    input: {}
  };
  connections
    .filter(c => c.to.id === id)
    .forEach(c => {
      // TODO: Fix for multiple outputs
      graph.input[c.to.name] = createGraph(nodes, connections, c.from.id);
      graph.input[c.to.name].name = c.from.name;
    });
  return graph;
}

const mapStateToProps = state => (
  {
    id: state.graph.selectedNode,
    graph: createGraph(state.graph.nodes, state.graph.connections, 0),
    selectedNode: state.graph.nodes[state.graph.selectedNode]
  }
);

const mapDispatchToProps = dispatch => (
  {
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    },
    selectNode: (nodeId) => {
      dispatch(actions.selectNode(nodeId));
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderCanvas);

export default Component;
