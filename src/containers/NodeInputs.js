import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NodeInputs from '../components/NodeInputs';
import * as actions from '../actions';

const mapStateToProps = state => (
  { }
);

const mapDispatchToProps = dispatch => (
  {
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeInputs);

export default Component;
