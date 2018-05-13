import React from 'react';
import PropTypes from 'prop-types';
import './VectorOverlay.less';
import draggable from '../../utils/DragDrop';
import { getSvgSize, addInSvgSpace } from '../../utils/SvgUtils';

let root = document.querySelector('#root');
class VectorOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.setSvg = this.setSvg.bind(this);
    this.onVectorHandleMouseDown = this.onVectorHandleMouseDown.bind(this);
    this.onVectorHandleMouseMove = this.onVectorHandleMouseMove.bind(this);
    this.onVectorHandleMouseUp = this.onVectorHandleMouseUp.bind(this);
    this.state = {
      size: [1, 1],
      lastPos: [0, 0],
      drag: null
    };
  }

  setSvg(svg) {
    this.svg = svg;
    this.point = svg.createSVGPoint();
    this.setState({
      size: getSvgSize(this.svg)
    });
  }

  onVectorHandleMouseDown(event) {
    event.preventDefault();
    root.addEventListener('mousemove', this.onVectorHandleMouseMove);
    this.setState({
      lastPos: [event.clientX, event.clientY],
      drag: event.target.getAttribute('data-handle')
    });
  }

  onVectorHandleMouseMove(event) {
    if(event.buttons === 0) {
      root.removeEventListener('mousemove', this.onVectorHandleMouseMove);
      return;
    }

    let deltaX = event.clientX - this.state.lastPos[0];
    let deltaY = event.clientY - this.state.lastPos[1];
    console.log(`drag ${this.state.drag}`);
    let value = JSON.parse(JSON.stringify(this.props.value));
    console.log(`delta: [${deltaX}, ${deltaY}]`);
    if(this.state.drag === 'from') {
      value[0] = addInSvgSpace(value[0], [deltaX, deltaY], this.svg, this.point);
    } else if(this.state.drag === 'to') {
      value[1] = addInSvgSpace(value[1], [deltaX, deltaY], this.svg, this.point);
    }
    console.log(`value: ${value}`);

    this.props.onChange(value);
      

    this.setState({
      lastPos: [event.clientX, event.clientY]
    });
  }

  onVectorHandleMouseUp(event) {
    event.preventDefault();
    root.removeEventListener('mousemove', this.onVectorHandleMouseMove);
  }

  render() {
    let { name, type, value } = this.props;
    let typeName = name;
    if(type.name !== undefined) {
      typeName = name;
    }
    let to = value[0];
    let from = value[1];
    let width = this.state.size[0];
    let height = this.state.size[1];
    let aspectRatio = height / width;
    return (
      <svg
        className="vector-overlay"
        ref={this.setSvg}
        viewBox={`0 0 1 1`}
        preserveAspectRatio="none"
      >
        <g transform={`translate(0 0.5)`}>
          <line
            x1={to[0]}
            y1={to[1]}
            x2={from[0]}
            y2={from[1]}
            stroke="rebeccapurple"
            strokeWidth="0.01"
          />
          <circle
            transform={`scale(${aspectRatio} 1)`}
            onMouseDown={this.onVectorHandleMouseDown}
            data-handle="from"
            cx={to[0]}
            cy={to[1]}
            fill="red"
            r="0.01"
          />
          <circle
            transform={`scale(${aspectRatio} 1) translate(${1.0/aspectRatio - 1.0})`}
            onMouseDown={this.onVectorHandleMouseDown}
            data-handle="to"
            cx={from[0]}
            cy={from[1]}
            preserveAspectRatio="none"
            fill="rebeccapurple"
            r="0.01"
          />
        </g>
      </svg>
    );
  }
}

VectorOverlay.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default VectorOverlay;
