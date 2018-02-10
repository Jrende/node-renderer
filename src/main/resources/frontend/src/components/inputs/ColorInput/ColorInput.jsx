import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { mat4, vec2, vec3, quat } from 'gl-matrix';
import colorWheelVert from './colorWheel.vert';
import colorWheelFrag from './colorWheel.frag';
import satValVert from './satVal.vert';
import satValFrag from './satVal.frag';
import VertexArray from '../../../gfx/VertexArray';
import Shader from '../../../gfx/shader/Shader';
import './style.less';

function getAllOffsetLeft(elm) {
  let offsetLeft = 0;
  while(elm !== null) {
    offsetLeft += elm.offsetLeft;
    elm = elm.offsetParent;
  }
  return offsetLeft;
}

function getAllOffsetTop(elm) {
  let offsetTop = 0;
  while(elm !== null) {
    offsetTop += elm.offsetTop;
    elm = elm.offsetParent;
  }
  return offsetTop;
}

function getAngle(v1, v2) {
  let v1n = vec2.normalize(vec2.create(), v1);
  let v2n = vec2.normalize(vec2.create(), v2);
  let dot = vec2.dot(v1n, v2n);
  let det = v1n[0]*v2n[1] - v1n[1]*v2n[0];
  let rad = Math.atan2(det, dot);
  if(rad < 0) {
    rad += 2*Math.PI;
  }
  return rad;
}


class ColorInput extends React.Component {
  constructor(props) {
    super(props);
    let col = tinycolor(props.value).toHsv();
    this.state = {
      hue: col.h,
      saturation: col.s,
      value: col.v,
      mouseDown: false
    };
    [
      'setCanvas',
      'onCanvasMouseDown',
      'onCanvasMouseMove',
      'onCanvasMouseUp'
    ].forEach(name => this[name] = this[name].bind(this));
  }

  /*
  componentWillReceiveProps(nextProps) {
    if (tinycolor.equals(nextProps.value, this.props.value)) {
      let col = tinycolor(nextProps.value).toHsv();
      this.setState({
        hue: col.h,
        saturation: col.s,
        value: col.v
      });
    }
  }
    */

  componentDidMount() {
    this.gl = this.canvas.getContext('webgl', {
      premultipliedAlpha: true,
      preserveDrawingBuffer: true
    });
    this.colorWheelShader = new Shader({ frag: colorWheelFrag, vert: colorWheelVert });
    this.colorWheelShader.compile(this.gl);
    this.satValShader = new Shader({ frag: satValFrag, vert: satValVert });
    this.satValShader.compile(this.gl);
    this.quad = new VertexArray(this.gl,
      [
        1, 1,
        -1, 1,
        -1, -1,
        1, -1
      ],
      [1, 0, 2,
        2, 0, 3],
      [2]);
    let t = [
      [0, 1.0],
      [-0.8660253882408142, -0.5],
      [0.8660253882408142, -0.5]
    ];
    this.triP = t;
    this.triangle = new VertexArray(this.gl,
      [
        t[0][0], t[0][1], 1.0, 1.0,
        t[1][0], t[1][1], 1.0, 0.0,
        t[2][0], t[2][1], 0.0, 1.0
      ],
      [0, 1, 2],
      [2, 2]);
    this.triangleModel = mat4.fromScaling(mat4.create(), [0.8, 0.8, 1.0]);

    this.gl.clearColor(0, 0, 0, 1.0);
    let color = tinycolor(this.props.value);
    this.renderCanvas(color.toHsv());
  }

  onCanvasMouseDown(event) {
    event.preventDefault();
    this.setState({ mouseDown: true });
    document.getElementById('root').addEventListener('mousemove', this.onCanvasMouseMove);
    console.log(`mouseDown ${this.state.mouseDown}`);
    let coords = [
      (event.pageX - getAllOffsetLeft(this.canvas)) / this.canvas.offsetWidth - 0.5,
      -(event.pageY - getAllOffsetTop(this.canvas)) / this.canvas.offsetHeight + 0.5
    ].map(c => c * 2.0);
    let { hue, saturation, value } = this.handleInput(coords);
    this.updateColor(hue, saturation, value);
  }


  onCanvasMouseMove(event) {
    event.preventDefault();
    if(this.state.mouseDown === true && event.buttons === 0) {
      this.setState({ mouseDown: false });
      document.getElementById('root').removeEventListener('mousemove', this.onCanvasMouseMove);
      return;
    }
    if(this.state.mouseDown) {
      console.log('canvas mouse move');
      let coords = [
        (event.pageX - getAllOffsetLeft(this.canvas)) / this.canvas.offsetWidth - 0.5,
        -(event.pageY - getAllOffsetTop(this.canvas)) / this.canvas.offsetHeight + 0.5
      ].map(c => c * 2.0);
      let { hue, saturation, value } = this.handleInput(coords);
      this.updateColor(hue, saturation, value);
    }
  }

  onCanvasMouseUp(event) {
    event.preventDefault();
    document.getElementById('root').removeEventListener('mousemove', this.onCanvasMouseMove);
    this.setState({ mouseDown: false, colorWheelToggle: false, triangleToggle: false });
    console.log(`mouseDown ${this.state.mouseDown}`);
  }

  handleInput(coords) {
    let { hue, saturation, value } = this.state;
    let positionInWheel = this.positionInWheel(coords);
    if(positionInWheel !== undefined) {
      hue = positionInWheel;
      this.setState({ colorWheelToggle: true });
    }
    let positionInTriangle = this.positionInTriangle(coords);
    if (positionInTriangle !== undefined) {
      saturation = Math.min(1 - positionInTriangle.w, 1.0);
      value = Math.min(1 - positionInTriangle.v, 1.0);
      this.setState({ triangleToggle: true });
    }
    return { hue, saturation, value };
  }

  updateColor(hue, saturation, value) {
    this.setState({ hue, saturation, value });

    let newColor = tinycolor.fromRatio({
      h: hue,
      s: saturation,
      v: value
    });
    this.props.onChange(newColor.toRgb());
  }

  positionInTriangle(coord) {
    let p = coord;
    let a = vec2.transformMat4(vec2.create(), this.triP[0], this.triangleModel);
    let b = vec2.transformMat4(vec2.create(), this.triP[1], this.triangleModel);
    let c = vec2.transformMat4(vec2.create(), this.triP[2], this.triangleModel);

    vec2.sub(b, b, a);
    vec2.sub(c, c, a);
    vec2.sub(p, p, a);

    let d = b[0]*c[1] - c[0]*b[1];
    let u = (p[0]*(b[1]-c[1]) + p[1]*(c[0]-b[0]) + b[0]*c[1] - c[0]*b[1])/d;
    let v = (p[0]*c[1] - p[1]*c[0])/d;
    let w = (p[1]*b[0]-p[0]*b[1])/d;

    // console.log(`u: ${u}, v: ${v}, w: ${w}`);
    if(!this.state.colorWheelToggle && (this.state.triangleToggle || (u > 0.0 && u < 1.0 &&
      v > 0.0 && v < 1.0 &&
      w > 0.0 && w < 1.0))) {
      return {
        u, v, w
      };
    }
    return undefined;
  }


  positionInWheel(p) {
    let center = [0, 0];
    let dist = vec2.distance(p, center);
    if(!this.state.triangleToggle && (this.state.colorWheelToggle || dist > 0.8 && dist < 1.0)) {
      return getAngle([1, 0], p) / (2.0 * Math.PI);
    }
    return undefined;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  renderCanvas() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.quad.bind(this.gl);

    let resolution = [
      this.canvas.clientWidth,
      this.canvas.clientHeight
    ];
    this.colorWheelShader.bind(this.gl);
    this.colorWheelShader.setUniforms(this.gl, {
      resolution
    });
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    this.quad.unbind(this.gl);
    this.colorWheelShader.unbind(this.gl);

    this.satValShader.bind(this.gl);
    this.triangle.bind(this.gl);
    mat4.fromRotationTranslationScale(
      this.triangleModel,
      quat.setAxisAngle(quat.create(), [0, 0, 1], this.state.hue * Math.PI * 2.0 - Math.PI/2.0),

      vec3.create(),
      [0.8, 0.8, 1.0]);
    this.satValShader.setUniforms(this.gl, {
      resolution,
      mvp: this.triangleModel,
      hue: this.state.hue
    });
    this.gl.drawElements(this.gl.TRIANGLES, 3, this.gl.UNSIGNED_SHORT, 0);
    this.triangle.unbind(this.gl);
    this.satValShader.unbind(this.gl);
  }

  render() {
    let { name, value } = this.props;
    let color = tinycolor(value);
    if(this.gl !== undefined) {
      this.renderCanvas(color.toHsv());
    }
    let bgColor = {
      backgroundColor: color.toHexString()
    };
    return (
      <fieldset>
        <canvas
          onMouseDown={this.onCanvasMouseDown}
          onMouseUp={this.onCanvasMouseUp}
          width="256"
          height="256"
          className="color-input-canvas"
          ref={this.setCanvas}
        />
        <div className="color-input-color" style={bgColor} />
      </fieldset>
    );
  }
}

ColorInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func
};

export default ColorInput;
