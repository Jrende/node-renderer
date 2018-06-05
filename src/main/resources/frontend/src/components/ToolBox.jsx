import React from 'react';
import PropTypes from 'prop-types';
import './ToolBox.less';
import Types from '../constants/Types';

class ToolBox extends React.Component {
  createNewNode(event, type) {
    let newNode = {
      type: type.id,
      pos: [0, 0]
    };
    this.props.createNewNode(newNode);
  }

  render() {
    let nodes = Object.keys(Types)
      .map(key => Types[key])
      .filter(type => type.id !== 0)
      .map(type =>
        (
          <div className="type" key={type.id} onClick={(event) => this.createNewNode(event, type)}>
            <div className="anfang">⁞</div>
            <p>{type.name}</p>
          </div>
        ));
    return nodes;
  }
}

ToolBox.propTypes = {
  createNewNode: PropTypes.func.isRequired
};

export default ToolBox;
