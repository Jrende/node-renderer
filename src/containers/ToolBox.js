import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ToolBox from '../components/ToolBox';

const mapStateToProps = state => {
  return {
    types: state.types
  }
};

const Component = connect(
  mapStateToProps
)(ToolBox);

export default Component;
