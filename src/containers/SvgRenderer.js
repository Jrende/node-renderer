import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgRenderer from '../components/svg/SvgRenderer';
import * as actions from '../actions';

function getConnections(graph) {
  let ret = [];
  graph.forEach(node => {
    if(node.input != null) {
      Object.keys(node.input).forEach(key => {
        ret.push([node.id, node.input[key].id]);
      });
    }
  });
  return ret;
}

const mapStateToProps = state => {
  return {
    connections: getConnections(state.nodes.graph),
    graph: state.nodes.graph
  }
};

const mapDispatchToProps = dispatch => {
  return {
    createNewNode: node => {
      dispatch(actions.createNewNode(node))
    },
    setNodeLocation: (id, pos) => {
      dispatch(actions.moveNode(id, pos))
    },
    connectNodes: (from, to) => {
      dispatch(actions.connectNodes(from, to))
    }
  }
}

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRenderer);

export default Component;
