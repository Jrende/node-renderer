import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Editor from '../../components/editor/Editor';
import { fetchSource } from '../../actions/api';

const mapStateToProps = state => (
  {
    selectedNode: state.nodes.graph.find(node => node.id === state.nodes.selectedNode)
  }
);

const mapDispatchToProps = dispatch => (
  {
    fetchSource: (id) => {
      dispatch(fetchSource(id));
    },
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);

export default Component;
