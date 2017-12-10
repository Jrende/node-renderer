import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RenderCanvas from '../../components/editor/RenderCanvas';

function getRootNote(graph) {
  let nodes = [];
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

const mapStateToProps = state => {
  return {
    rootNode: getRootNote(state.nodes.graph)
  };
};

const Component = connect(
  mapStateToProps
)(RenderCanvas);

export default Component;
