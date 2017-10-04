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
    this.props.changeValue(this.props.selectedNode.id, {[name]: value});
  }

  render() {
    let { selectedNode } = this.props;

    let inputs = [];
    if(selectedNode !== undefined && selectedNode.type.values != undefined) {
      inputs = Object.keys(selectedNode.type.values).map(key => {
        let value = selectedNode.type.values[key];
        if(value.type === "number") {
          return (
            <NumberInput key={key} name={key} type={value} value={selectedNode.values[key]} onChange={(value) => this.onValueChange(key, value)} />
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
  selectedNode: PropTypes.object,
  changeValue: PropTypes.func
}

export default NodeInputs;
