import React from 'react';
import PropTypes from 'prop-types';
import './Node.less';
import NodeInputs from './inputs/NodeInputs';

export default function SvgNode(props) {
  let {
    id,
    node,
    pos,
    onDragbarMouseDown,
    onConnectorMouseDown,
    onNodeTouchStart,
    onMouseUp,
    onFocus,
    selected,
    removeNode,
    connections,
    handleNodeTouchMove,
    handleTouchEnd
  } = props;

  let outputs = [];
  if(node.id !== 0) {
    outputs = Object.keys(node.type.output).map(key => {
      let name = node.type.output[key].name;
      return (
        <div key={key}>
          <span className="io">{name}</span>
          <span
            className="io-grab-output"
            onPointerDown={onConnectorMouseDown}
            data-output-name={key}
          />
        </div>
      );
    });
  }
  let classes = `svg-node html-node ${selected ? 'selected' : ''}`;

  return (
    <div
      onFocus={onFocus}
      style={{
        left: `${pos[0]}px`,
        top: `${pos[1]}px`,
      }}
      data-node-id={id}
      className={classes}
      onTouchStart={onNodeTouchStart}
      onTouchMove={handleNodeTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="drag-bar"
        onPointerDown={onDragbarMouseDown}
        onPointerUp={onMouseUp}
      >
        {node.id !== 0 &&
        <button
          className="delete"
          onClick={() => removeNode(id)}
        >
          ×
        </button>}
      </div>
      <div className="inner">
        <h3>{node.type.name}</h3>
        <div className="outputs">
          {outputs}
        </div>
        <hr />
        <NodeInputs
          connections={connections}
          onConnectorMouseDown={onConnectorMouseDown}
          node={node}
          id={id}
        />
      </div>
    </div>
  );
}

SvgNode.propTypes = {
  id: PropTypes.number.isRequired,
  pos: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired,
  removeNode: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  onDragbarMouseDown: PropTypes.func.isRequired,
  onNodeTouchStart: PropTypes.func.isRequired,
  onConnectorMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func,
  connections: PropTypes.array.isRequired,
};
