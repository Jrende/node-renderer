import { connect } from 'react-redux';
import RenderCanvas from '../components/RenderCanvas';

function getRootNote(graph) {
  let nodes = [];
  // TODO: Do this without assigning to state
  graph.forEach(node => nodes[node.id] = node);
  let newGraph = graph.map(node => {
    let inputs = Object.assign({}, node.input);
    Object.keys(inputs).forEach(key => {
      inputs[key].node = nodes[inputs[key].id];
    });
    let newNode = Object.assign({}, node, {
      input: Object.assign({}, node.input, inputs)
    });
    return newNode;
  });
  return newGraph.find(node => node.id === 0);
}

const mapStateToProps = state => (
  {
    rootNode: getRootNote(state.nodes.graph)
  }
);

const Component = connect(
  mapStateToProps
)(RenderCanvas);

export default Component;
