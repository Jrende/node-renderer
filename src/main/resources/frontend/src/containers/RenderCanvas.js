import { connect } from 'react-redux';
import RenderCanvas from '../components/RenderCanvas';

function createGraph(nodes, connections, id) {
  let graph = {
    id,
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
    graph: createGraph(state.graph.nodes, state.graph.connections, 0)
  }
);

const Component = connect(
  mapStateToProps
)(RenderCanvas);

export default Component;
