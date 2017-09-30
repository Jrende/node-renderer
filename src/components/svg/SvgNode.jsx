import React from 'react';
import PropTypes from 'prop-types';
import './SvgNode.less';

export default function SvgNode({
  node,
  onElementMouseDown,
  onConnectorMouseDown,
  connectorPosFunc,
  onConnectorMouseUp,
  onMouseUp
}) {
  let height = 20;
  let width = 100;
  let offset = 40;
  let sideMargin = 10;
  let inputs = [];
  if(node.type.input != null) {
    inputs = Object.keys(node.type.input).map(key => {
      let name = node.type.input[key].name;
      let pos = connectorPosFunc(key);
      return (
        <g key={key} transform={`translate(${pos[0]} ${pos[1]})`} >
          <rect
            transform="translate(-25 -10)"
            width="20"
            height="10"
            rx="2"
            ry="2"
            fill="#000000"
            onMouseDown={onConnectorMouseDown}
            data-input-name={key}
            onMouseUp={onConnectorMouseUp}
          />
          <text className="io">{name}</text>
        </g>
      );
    });
  }
  let outputs = [];
  if(node.type.output != null) {
    outputs = Object.keys(node.type.output).map(key => {
      let name = node.type.output[key].name;
      let pos = connectorPosFunc(key);
      return (
        <g key={key} transform={`translate(${pos[0]} ${pos[1]})`}>
          <rect
            transform="translate(5 -10)"
            width="20"
            height="10"
            rx="2"
            ry="2"
            fill="#000000"
            onMouseDown={onConnectorMouseDown}
            data-output-name={key}
            onMouseUp={onConnectorMouseUp}
          />
          <text className="io">{name}</text>
        </g>
      );
    });
  }

  height += Math.max(inputs.length, outputs.length) * 25;

  return (
    <g className="svg-node" transform={`translate(${node.pos[0]} ${node.pos[1]})`} onMouseDown={onElementMouseDown} onMouseUp={onMouseUp} data-node-id={node.id}>
      <rect width={width} height={height} rx="5" ry="5" fill="#d4d4d4" />
      <text className="title" transform="translate(5 16)">{node.type.name}</text>
      <line x1="0" y1="20" x2={width} y2="20" />
      <g className="inputs">
        {inputs}
      </g>
      <g className="outputs">
        {outputs}
      </g>
    </g>
  );
}

SvgNode.propTypes = {
  node: PropTypes.object.isRequired,
  onElementMouseDown: PropTypes.func,
  onConnectorMouseDown: PropTypes.func,
  connectorPosFunc: PropTypes.func,
  onConnectorMouseUp: PropTypes.func,
  onMouseUp: PropTypes.func
}
