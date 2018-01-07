import React from 'react';
import PropTypes from 'prop-types';
import './SvgNode.less';

export default function SvgNode(props) {
  let {
    id,
    node,
    onElementMouseDown,
    onConnectorMouseDown,
    nodeLayout,
    onConnectorMouseUp,
    onMouseUp,
    onFocus,
    selected
  } = props;
  let height = nodeLayout.height;
  let width = nodeLayout.width;
  let inputs = [];
  if(node.type.input != null) {
    inputs = Object.keys(node.type.input).map(key => {
      let name = node.type.input[key].name;
      let pos = nodeLayout.getConnectorPos(key);
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
      let pos = nodeLayout.getConnectorPos(key);
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
    <g
      tabindex="0"
      onFocus={onFocus}
      className={`svg-node ${selected ? 'selected' : ''}`}
      transform={`translate(${node.pos[0]} ${node.pos[1]})`}
      onMouseDown={onElementMouseDown}
      onMouseUp={onMouseUp}
      data-node-id={id}
    >
      <rect className="node-body" width={width} height={height} rx="5" ry="5" fill="#d4d4d4" />
      <text className="title" transform="translate(5 16)">{node.type.name}</text>
      <line className="underline" x1="0" y1="20" x2={width} y2="20" />
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
  id: PropTypes.number.isRequired,
  node: PropTypes.object.isRequired,
  nodeLayout: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onElementMouseDown: PropTypes.func.isRequired,
  onConnectorMouseDown: PropTypes.func.isRequired,
  onConnectorMouseUp: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func
};
