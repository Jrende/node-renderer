import React from 'react';
import PropTypes from 'prop-types';
import './SvgNode.less';

export default function SvgNode(props) {
  let {
    id,
    node,
    onElementMouseDown,
    onConnectorMouseDown,
    onConnectorMouseUp,
    onMouseUp,
    onFocus,
    selected,
    htmlNodeCanvas
  } = props;
  let inputs = [];
  if(node.type.input != null) {
    inputs = Object.keys(node.type.input).map(key => {
      let name = node.type.input[key].name;
      return (
        <div key={key}>
          <span
            className="io-grab"
            onMouseDown={onConnectorMouseDown}
            data-input-name={key}
            onMouseUp={onConnectorMouseUp}
          />
          <span className="io">{name}</span>
        </div>
      );
    });
  }

  let outputs = [];
  if(node.type.output != null) {
    outputs = Object.keys(node.type.output).map(key => {
      let name = node.type.output[key].name;
      return (
        <div>
          <span className="io">{name}</span>
          <span
            className="io-grab"
            onMouseDown={onConnectorMouseDown}
            data-output-name={key}
            onMouseUp={onConnectorMouseUp}
          />
        </div>
      );
    });
  }
  let left = node.pos[0];
  let top = node.pos[1];
  if(htmlNodeCanvas !== undefined) {
    let rect = htmlNodeCanvas.getBoundingClientRect();
    left = node.pos[0] + rect.width / 2;
    top = node.pos[1] + rect.height / 2;
  }

  return (
    <div
      tabindex="0"
      onFocus={onFocus}
      style={{ left: `${left}px`, top: `${top}px` }}
      data-node-id={id}
      className={`svg-node html-node ${selected ? 'selected' : ''}`}
    >
      <div
        className="drag-bar"
        onMouseDown={onElementMouseDown}
        onMouseUp={onMouseUp}
      />
      <h3>{node.type.name}</h3>
      <div className="connections">
        <div className="inputs">
          {inputs}
        </div>
        <div className="outputs">
          {outputs}
        </div>
      </div>
    </div>
  );
}

SvgNode.propTypes = {
  id: PropTypes.number.isRequired,
  htmlNodeCanvas: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onElementMouseDown: PropTypes.func.isRequired,
  onConnectorMouseDown: PropTypes.func.isRequired,
  onConnectorMouseUp: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func
};
