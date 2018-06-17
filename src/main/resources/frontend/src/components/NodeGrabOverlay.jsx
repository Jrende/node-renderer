import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './NodeGrabOverlay.less';
// import Types from '../constants/Types';
import * as actions from '../actions';

class NodeGrabOverlay extends React.Component {
  createNewNode(event, type) {
    let newNode = {
      type: type.id,
      pos: [0, 0]
    };
    this.props.createNewNode(newNode);
  }

  render() {
    return (
      <div className="node-grab-overlay">
      </div>
    );
  }
}

NodeGrabOverlay.propTypes = {
  createNewNode: PropTypes.func.isRequired,
};


const Component = connect(
  state => ({
    amountOfNodes: state.graph.nodes.length,
  }),
  dispatch => (
    {
      createNewNode: node => {
        dispatch(actions.createNewNode(node));
      }
    }
  )
)(NodeGrabOverlay);

export default Component;

