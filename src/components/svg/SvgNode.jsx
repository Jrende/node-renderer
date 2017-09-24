import React from 'react';
import PropTypes from 'prop-types'
import './SvgNode.less';

export class SvgNode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { node } = this.props;
    let height = 20;
    let width = 100;
    let offset = 40;
    let sideMargin = 10;
    let inputs = [];
    if(node.type.input != null) {
      inputs = Object.keys(node.type.input).map((name, index) => {
          return (
            <g key={name} transform={`translate(0 ${index * 20})`} >
              <rect transform={`translate(-25 -10)`} width="20" height="10" rx="2" ry="2" fill="#000000" onMouseDown={this.props.onConnectorMouseDown} data-input-name={name} onMouseUp={this.props.onConnectorMouseUp}></rect>
              <text className="io">{name}</text>
            </g>
          )
      });
    }
    let outputs = [];
    if(node.type.output != null) {
      outputs = Object.keys(node.type.output).map((name, index) => {
          return (
            <g key={name} transform={`translate(${width} ${index * 20})`}>
              <rect transform={`translate(5 -10)`} width="20" height="10" rx="2" ry="2" fill="#000000" onMouseDown={this.props.onConnectorMouseDown} data-output-name={name} onMouseUp={this.props.onConnectorMouseUp}></rect>
              <text className="io">{name}</text>
            </g>
          )
      });
    }

    height += Math.max(inputs.length, outputs.length) * 25;

    return (
      <g className="svg-node" transform={`translate(${node.pos[0] - height/2.0} ${node.pos[1]})`} onMouseDown={this.props.onElementMouseDown} onMouseUp={this.props.onMouseUp} data-node-id={node.id}>
        <rect width={width} height={height} rx="5" ry="5" fill="#d4d4d4"></rect>
        <text className="title" transform={`translate(5 16)`}>{node.name}</text>
        <line x1="0" y1="20" x2={width} y2="20"></line>
        <g className="inputs" transform={`translate(${sideMargin} ${offset})`}>
          {inputs}
        </g>
        <g className="outputs" transform={`translate(-${sideMargin} ${offset})`}>
          {outputs}
        </g>
      </g>
    )
  }
}

SvgNode.propTypes = {
  node: PropTypes.object.isRequired,
  onElementMouseDown: PropTypes.func,
  onConnectorMouseDown: PropTypes.func,
  onConnectorMouseUp: PropTypes.func,
  onMouseUp: PropTypes.func
}
