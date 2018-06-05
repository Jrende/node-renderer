import React from 'react';
import PropTypes from 'prop-types';
import './ToolBox.less';

class ToolBox extends React.Component {
  createNewNode(event, type) {
    let newNode = {
      type: type.id,
      pos: [0, 0]
    };
    this.props.createNewNode(newNode);
  }

  render() {
    let { types } = this.props;

    let nodes = Object.keys(types)
      .map(key => types[key])
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
  types: PropTypes.object.isRequired,
  createNewNode: PropTypes.func.isRequired
};

export default ToolBox;
