import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { mat4, vec2 } from 'gl-matrix';
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

class ColorInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.setCanvas = this.setCanvas.bind(this);
    this.onCanvasClick = this.onCanvasClick.bind(this);
  }

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
    this.renderCanvas(this.props.value);
  }

  onChange(event) {
    let value = event.target.value;
    let color = tinycolor(value);
    this.props.onChange(color.toRgb());
  }

  onCanvasClick(event) {
    let coords = [
      (event.pageX - getAllOffsetLeft(this.canvas)) / this.canvas.offsetWidth - 0.5,
      -(event.pageY - getAllOffsetTop(this.canvas)) / this.canvas.offsetHeight + 0.5
    ]
      .map(c => c * 2.0);
    /*
    if(this.clickedOnWheel(coords)) {
      console.log('clicked on color wheel');
    }
    */
    if (this.clickedOnTriangle(coords)) {
      console.log('clicked on triangle');
    }
  }

  /*
  clickedOnTriangle(p) {
    let pt = vec2.transformMat4(vec2.create(), p, this.triangleModel);
    let at = vec2.transformMat4(vec2.create(), this.triP[0], this.triangleModel);
    let bt = vec2.transformMat4(vec2.create(), this.triP[1], this.triangleModel);
    let ct = vec2.transformMat4(vec2.create(), this.triP[2], this.triangleModel);

    let v0 = vec2.sub(vec2.create(), bt, at);
    let v1 = vec2.sub(vec2.create(), ct, at);
    let v2 = vec2.sub(vec2.create(), pt, at);

    let a = vec2.dot(v0, v0);
    let b = vec2.dot(v1, v1);
    let c = vec2.dot(v1, v0);
    let d = vec2.dot(v2, v0);
    let e = vec2.dot(v2, v1);

    let divisor = a*b - c*c;

    let u = (b*d - c*e)/divisor;
    let v = (a*e - c*d)/divisor;

    console.log(`u: ${u}, v: ${v}`);
    return false;
  }
  */

  clickedOnTriangle(coord) {
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

    console.log(`u: ${u}, v: ${v}, w: ${w}`);
    return u > 0.0 && u < 1.0 &&
      v > 0.0 && v < 1.0 &&
      w > 0.0 && w < 1.0;
  }

  clickedOnWheel(p) {
    let dist = vec2.distance(p, [0.5, 0.5]);
    return (dist > 0.4 && dist < 0.5);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  renderCanvas(color) {
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
    this.satValShader.setUniforms(this.gl, {
      resolution,
      mvp: this.triangleModel,
      inputColor: [
        color.r / 255,
        color.g / 255,
        color.b / 255
      ]
    });
    this.gl.drawElements(this.gl.TRIANGLES, 3, this.gl.UNSIGNED_SHORT, 0);
    this.triangle.unbind(this.gl);
    this.satValShader.unbind(this.gl);
  }

  render() {
    let { name, value } = this.props;
    if(this.gl !== undefined) {
      this.renderCanvas(value);
    }
    return (
      <fieldset>
        <canvas
          onClick={this.onCanvasClick}
          width="256"
          height="256"
          className="color-input-canvas"
          ref={this.setCanvas}
        />
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
