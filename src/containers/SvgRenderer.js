import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgRenderer from '../components/svg/SvgRenderer';
import { createNewNode, moveNode } from '../actions';

function getConnections(graphs) {
  let ret = [];
  graphs.forEach(graph => getConnectionsRecurse(graph, -1, ret));
  return ret;
}

function getConnectionsRecurse(graph, parent, ret=[]) {
  if(graph.input != null) {
    Object.keys(graph.input).forEach(key => {
      let child = graph.input[key];
      getConnectionsRecurse(child, graph.id, ret);
    });
  }
  if(parent !== -1) {
    ret.push([graph.id, parent]);
  }
  return ret;
}

function getNodes(graphs) {
  let ret = [];
  graphs.forEach(graph => getNodeRecursive(graph, ret));
  return ret;
}

function getNodeRecursive(graph, ret) {
  ret.push(graph);
  if(graph.input != null) {
    Object.keys(graph.input).forEach(input => {
      getNodeRecursive(nodes, graph.input[input]);
    });
  }
}

const mapStateToProps = state => {
  let nodes = getNodes(state.nodes.graph);
  let connections = getConnections(state.nodes.graph);
  return {
    nodes,
    connections,
    graph: state.nodes.graph
  }
};

const mapDispatchToProps = dispatch => {
  return {
    createNewNode: node => {
      dispatch(createNewNode(node))
    },
    setNodeLocation: (id, pos) => {
      dispatch(moveNode(id, pos))
    }
  }
}

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRenderer);

export default Component;
