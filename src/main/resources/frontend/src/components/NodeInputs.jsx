import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberInput from './inputs/NumberInput';
import ColorInput from './inputs/ColorInput';
import EnumInput from './inputs/EnumInput';
import GradientInput from './inputs/GradientInput';
import VectorInput from './inputs/VectorInput';
import * as actions from '../actions';

import './NodeInputs.less';


class NodeInputs extends React.Component {
  onValueChange(name, value) {
    this.props.changeValue(this.props.id, { [name]: value });
  }

  render() {
    let { node, onConnectorMouseDown } = this.props;

    let inputs = [];
    if(node !== undefined && node.type.values !== undefined) {
      inputs = Object.keys(node.type.values).map(key => {
        let nodeValue = node.type.values[key];
        switch(nodeValue.type) {
          case 'number':
            return (
              <div className="node-input" key={key}>
                <div>
                  <span
                    className="io-grab"
                    onMouseDown={onConnectorMouseDown}
                    data-input-name={key}
                  />
                  <span className="io">{name}</span>
                </div>
                <NumberInput
                  name={key}
                  type={nodeValue}
                  value={parseFloat(node.values[key])}
                  onChange={(value) => this.onValueChange(key, value)}
                />
              </div>
            );
          case 'color':
            return (
              <div className="node-input" key={key}>
                <div>
                  <span
                    className="io-grab"
                    onMouseDown={onConnectorMouseDown}
                    data-input-name={key}
                  />
                  <span className="io">{name}</span>
                </div>
                <ColorInput
                  name={key}
                  type={nodeValue}
                  value={node.values[key]}
                  onChange={(value) => this.onValueChange(key, value)}
                />
              </div>
            );
          case 'enum':
            return (
              <div className="node-input" key={key}>
                <EnumInput
                  name={key}
                  type={nodeValue}
                  value={node.values[key]}
                  onChange={(value) => this.onValueChange(key, value)}
                />
              </div>
            );
          case 'gradient':
            return (
              <div className="node-input" key={key}>
                <GradientInput
                  name={key}
                  type={nodeValue}
                  value={node.values[key]}
                  onChange={(value) => this.onValueChange(key, value)}
                />
              </div>
            );
          case 'vector':
            return (
              <div className="node-input" key={key}>
                <VectorInput
                  name={key}
                  type={nodeValue}
                  value={node.values[key]}
                  onChange={(value) => this.onValueChange(key, value)}
                />
              </div>
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
  changeValue: PropTypes.func.isRequired,
  onConnectorMouseDown: PropTypes.func.isRequired
};


export default connect(
  undefined,
  (dispatch) => ({
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    }
  })
)(NodeInputs);
