import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from './inputs/NumberInput';
import ColorInput from './inputs/ColorInput';
import EnumInput from './inputs/EnumInput';
import GradientInput from './inputs/GradientInput';

import './NodeInputs.less';


class NodeInputs extends React.Component {
  onValueChange(name, value) {
    this.props.changeValue(this.props.id, { [name]: value });
  }

  render() {
    let { selectedNode } = this.props;

    let inputs = [];
    if(selectedNode !== undefined && selectedNode.type.values !== undefined) {
      inputs = Object.keys(selectedNode.type.values).map(key => {
        let nodeValue = selectedNode.type.values[key];
        switch(nodeValue.type) {
          case 'number':
            return (
              <NumberInput
                key={key}
                name={key}
                type={nodeValue}
                value={parseFloat(selectedNode.values[key])}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'color':
            return (
              <ColorInput
                key={key}
                name={key}
                type={nodeValue}
                value={selectedNode.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'enum':
            return (
              <EnumInput
                key={key}
                name={key}
                type={nodeValue}
                value={selectedNode.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'gradient':
            return (
              <GradientInput
                key={key}
                name={key}
                type={nodeValue}
                value={selectedNode.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          default:
            break;
        }
        return null;
      });
    }
    return [
      <h1 key="NodeInputs">NodeInputs</h1>,
      ...inputs
    ];
  }
}

NodeInputs.propTypes = {
  selectedNode: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  changeValue: PropTypes.func.isRequired,
};

export default NodeInputs;
