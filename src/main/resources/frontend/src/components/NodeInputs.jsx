import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from './inputs/NumberInput';
import ColorInput from './inputs/ColorInput';
import EnumInput from './inputs/EnumInput';
import GradientInput from './inputs/GradientInput';
import VectorInput from './inputs/VectorInput';

import './NodeInputs.less';


class NodeInputs extends React.Component {
  onValueChange(name, value) {
    this.props.changeValue(this.props.id, { [name]: value });
  }

  render() {
    let { node } = this.props;

    let inputs = [];
    if(node !== undefined && node.type.values !== undefined) {
      inputs = Object.keys(node.type.values).map(key => {
        let nodeValue = node.type.values[key];
        switch(nodeValue.type) {
          case 'number':
            return (
              <NumberInput
                key={key}
                name={key}
                type={nodeValue}
                value={parseFloat(node.values[key])}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'color':
            return (
              <ColorInput
                key={key}
                name={key}
                type={nodeValue}
                value={node.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'enum':
            return (
              <EnumInput
                key={key}
                name={key}
                type={nodeValue}
                value={node.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'gradient':
            return (
              <GradientInput
                key={key}
                name={key}
                type={nodeValue}
                value={node.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          case 'vector':
            return (
              <VectorInput
                key={key}
                name={key}
                type={nodeValue}
                value={node.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          default:
            break;
        }
        return null;
      });
    }
    return (
      <div key="Node-inputs" className="node-inputs">
        {inputs}
      </div>
    );
  }
}

NodeInputs.propTypes = {
  node: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  changeValue: PropTypes.func.isRequired
};

export default NodeInputs;
