import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberInput from './inputs/NumberInput';
import './NodeInputs.less';


class NodeInputs extends React.Component {
  constructor(props) {
    super(props);
  }

  onValueChange(name, value) {
    console.log(`Change ${name} to ${value}`);
    this.props.changeValue(this.props.node.id, {[name]: value});
  }

  render() {
    let { node } = this.props;

    let inputs = [];
    if(node !== undefined && node.type.values != undefined) {
      inputs = Object.keys(node.type.values).map(key => {
        let value = node.type.values[key];
        if(value.type === "number") {
          return (
            <NumberInput key={key} name={key} type={value} value={node.values[key]} onChange={(value) => this.onValueChange(key, value)} />
          )
        }
      });
    }
    return (
      <div className="node-inputs">
        <h1>NodeInputs</h1>
        {inputs}
      </div>
    );
  }
}

NodeInputs.propTypes = {
  node: PropTypes.object,
  changeValue: PropTypes.func
}

export default NodeInputs;
