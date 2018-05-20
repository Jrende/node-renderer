import React from 'react';
import PropTypes from 'prop-types';
import { vec2 } from 'gl-matrix';
import './VectorOverlay.less';
import { getSvgSize, addInSvgSpace } from '../../utils/SvgUtils';

let root = document.querySelector('#root');
class VectorOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.setSvg = this.setSvg.bind(this);
    this.onVectorHandleMouseDown = this.onVectorHandleMouseDown.bind(this);
    this.onVectorHandleMouseMove = this.onVectorHandleMouseMove.bind(this);
    this.onVectorHandleMouseUp = this.onVectorHandleMouseUp.bind(this);
    this.resize = this.resize.bind(this);
    this.state = {
      width: 1,
      height: 1,
      lastPos: [0, 0],
      drag: null
    };
  }

  setSvg(svg) {
    this.svg = svg;
    if(svg != undefined) {
      this.point = svg.createSVGPoint();
      this.resize();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    let size = getSvgSize(this.svg);
    this.setState({
      width: size[0],
      height: size[1]
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
    deltaX /= this.state.width;
    deltaY /= this.state.height;
    let value = JSON.parse(JSON.stringify(this.props.value));
    if(this.state.drag === 'from') {
      value[0] = addInSvgSpace(value[0], [deltaX, deltaY], this.svg, this.point);
    } else if(this.state.drag === 'to') {
      value[1] = addInSvgSpace(value[1], [deltaX, deltaY], this.svg, this.point);
    }

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
    let typeName = '';
    if(type.name !== undefined) {
      typeName = name;
    }

    let width = this.state.width;
    let height = this.state.height;

    let from = vec2.clone(value[0]);
    from[0] *= width;
    from[1] *= height;
    let to = vec2.clone(value[1]);
    to[0] *= width;
    to[1] *= height;
    vec2.add(to, to, [0, height/2]);
    vec2.add(from, from, [0, height/2]);
    let strokeWidth = 10;

    return (
      <svg
        className="vector-overlay"
        ref={this.setSvg}
      >
        <g transform="translate(0 0.5)">
          <line
            x1={to[0]}
            y1={to[1]}
            x2={from[0]}
            y2={from[1]}
            stroke="rebeccapurple"
            strokeWidth={strokeWidth}
          />
          <circle
            onMouseDown={this.onVectorHandleMouseDown}
            data-handle="to"
            cx={to[0]}
            cy={to[1]}
            fill="red"
            r={strokeWidth}
          />
          <circle
            onMouseDown={this.onVectorHandleMouseDown}
            data-handle="from"
            cx={from[0]}
            cy={from[1]}
            preserveAspectRatio="none"
            fill="rebeccapurple"
            r={strokeWidth}
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
