import React from 'react';
import PropTypes from 'prop-types';
import './SvgNode.less';
import NodeInputs from '../NodeInputs';

export default function SvgNode(props) {
  let {
    id,
    node,
    pos,
    onElementMouseDown,
    onConnectorMouseDown,
    onMouseUp,
    onFocus,
    selected,
    zoom,
    pan
  } = props;

  let outputs = [];
  if(node.type.output != null) {
    outputs = Object.keys(node.type.output).map(key => {
      let name = node.type.output[key].name;
      return (
        <div key={key}>
          <span className="io">{name}</span>
          <span
            className="io-grab"
            onMouseDown={onConnectorMouseDown}
            data-output-name={key}
          />
        </div>
      );
    });
  }

  return (
    <div
      onFocus={onFocus}
      style={{
        left: `${pos[0]}px`,
        top: `${pos[1]}px`,
      }}
      data-node-id={id}
      className={`svg-node html-node ${selected ? 'selected' : ''}`}
    >
      <div
        className="drag-bar"
        onMouseDown={onElementMouseDown}
        onMouseUp={onMouseUp}
      />
      <h3>{node.type.name}</h3>
      <div className="outputs">
        {outputs}
      </div>
      <hr />
      <NodeInputs onConnectorMouseDown={onConnectorMouseDown} node={node} id={id} />
    </div>
  );
}

SvgNode.propTypes = {
  id: PropTypes.number.isRequired,
  pos: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onElementMouseDown: PropTypes.func.isRequired,
  onConnectorMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func
};
