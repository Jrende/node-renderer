import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './ToolBox.less';
import Types from '../constants/Types';
import * as actions from '../actions';


let root = document.querySelector('#root');
class ToolBox extends React.Component {
  constructor() {
    super();
    this.grabNodePlaceholder = this.grabNodePlaceholder.bind(this);
    this.stopGrab = this.stopGrab.bind(this);
  }

  grabNodePlaceholder(type) {
    // Create invisible overlay to handle mouse up, instead of using root
    this.props.grabNodePlaceholder(type);
    root.addEventListener('mouseUp', this.stopGrab);
  }

  stopGrab() {
    this.props.grabNodePlaceholder(null);
    root.removeEventListener('mouseUp', this.stopGrab);
    this.props.onMouseUp();
  }

  render() {
    let nodes = Object.keys(Types)
      .map(key => Types[key])
      .filter(type => type.id !== 0)
      .map(type =>
        (
          <div className="type" key={type.id} onMouseDown={() => this.grabNodePlaceholder(type)}>
            <div className="anfang">⁞</div>
            <p>{type.name}</p>
          </div>
        ));
    return nodes;
  }
}

ToolBox.propTypes = {
  onMouseUp: PropTypes.func
};

const Component = connect(
  state => ({
    amountOfNodes: state.graph.nodes.length,
  }),
  dispatch => (
    {
      grabNodePlaceholder: (nodeType) => {
        dispatch(actions.grabNodePlaceholder(nodeType));
      }
    }
  )
)(ToolBox);

export default Component;

