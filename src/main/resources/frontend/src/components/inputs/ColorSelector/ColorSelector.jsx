import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { mat4, vec2, vec3, quat } from 'gl-matrix';
import colorWheelVert from './colorWheel.vert';
import colorWheelFrag from './colorWheel.frag';
import satValVert from './satVal.vert';
import satValFrag from './satVal.frag';
import solidFrag from './solid.frag';
import solidVert from './solid.vert';
import VertexArray from '../../../gfx/VertexArray';
import Shader from '../../../gfx/shader/Shader';
import Ring from '../../../gfx/geometry/Ring';
import './style.less';

function isHex(h) {
  let a = parseInt(h, 16);
  return (a.toString(16) === h);
}

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

let root = document.querySelector('#root');
class ColorSelector extends React.Component {
  constructor(props) {
    super(props);
    let color = tinycolor.fromRatio(props.value);
    let hsv = color.toHsv();
    this.state = {
      hue: hsv.h / 360,
      value: hsv.v,
      saturation: hsv.s,
      hexInput: color.toHex()
    };
    this.mouseDown = false;
    this.colorWheelToggle = false;
    this.triangleToggle = false;
    [
      'setCanvas',
      'onCanvasMouseDown',
      'onCanvasMouseMove',
      'onCanvasMouseUp',
      'onHexInputChange'
    ].forEach(name => this[name] = this[name].bind(this));
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
    this.solidShader = new Shader({ frag: solidFrag, vert: solidVert });
    this.solidShader.compile(this.gl);
    this.quad = new VertexArray(
      this.gl,
      [
        1, 1,
        -1, 1,
        -1, -1,
        1, -1
      ],
      [1, 0, 2,
        2, 0, 3],
      [2]
    );
    let t = [
      [0, 1.0],
      [0.8660253882408142, -0.5],
      [-0.8660253882408142, -0.5]
    ];
    this.triP = t;
    this.triPT = [
      vec2.create(),
      vec2.create(),
      vec2.create()
    ];
    let uv = [
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
    ];
    this.triUV = uv;
    this.triangle = new VertexArray(
      this.gl,
      [
        t[0][0], t[0][1], uv[0][0], uv[0][1], uv[0][2],
        t[1][0], t[1][1], uv[1][0], uv[1][1], uv[1][2],
        t[2][0], t[2][1], uv[2][0], uv[2][1], uv[2][2],
      ],
      [1, 0, 2],
      [2, 3]
    );
    this.ring = new Ring(this.gl, 24, 0.6);
    this.triangleModel = mat4.create();

    this.gl.clearColor(0, 0, 0, 1.0);
    let color = tinycolor(this.props.value);
    this.renderCanvas(color);
  }

  onHexInputChange(event) {
    let str = event.target.value;
    let color = tinycolor(`#${str}`);
    if(str.length === 6 && color.isValid()) {
      let hsv = color.toHsv();
      this.updateColor(
        hsv.h / 360,
        hsv.s,
        hsv.v
      );
    } else if (str.length <= 6 && (str === '' || isHex(str))) {
      this.setState({ hexInput: str });
    }
  }

  onCanvasMouseDown(event) {
    event.preventDefault();
    root.addEventListener('mousemove', this.onCanvasMouseMove);
    this.mouseDown = true;
    let coords = [
      (event.pageX - getAllOffsetLeft(this.canvas)) / this.canvas.offsetWidth - 0.5,
      -(event.pageY - getAllOffsetTop(this.canvas)) / this.canvas.offsetHeight + 0.5
    ].map(c => c * 2.0);
    let { hue, saturation, value } = this.handleInput(coords);
    this.updateColor(hue, saturation, value);
  }


  onCanvasMouseMove(event) {
    event.preventDefault();
    if(this.mouseDown === true && event.buttons === 0) {
      this.mouseDown = false;
      this.colorWheelToggle = false;
      this.triangleToggle = false;
      root.removeEventListener('mousemove', this.onCanvasMouseMove);
      return;
    }
    if(this.mouseDown) {
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
    root.removeEventListener('mousemove', this.onCanvasMouseMove);
    this.mouseDown = false;
    this.colorWheelToggle = false;
    this.triangleToggle = false;
  }

  handleInput(coords) {
    let { hue, saturation, value } = this.state;
    let positionInWheel = this.positionInWheel(coords);
    if(positionInWheel !== undefined) {
      hue = positionInWheel;
      this.colorWheelToggle = true;
    }
    let positionInTriangle = this.positionInTriangle(coords);
    if (positionInTriangle !== undefined) {
      let pos = positionInTriangle;
      if(pos.w + pos.v > 1.0 || pos.v < 0 || pos.w < 0) {
        pos = this.getClosestPointToTriangle(pos, coords);
      }

      value = Math.max(0, Math.min(1.0, 1.0 - pos.w));
      saturation = Math.max(0, Math.min(1.0, pos.u / value));
      // Still some weirdness when value is around zero
      if(Number.isNaN(saturation)) {
        saturation = 0.0;
      }
      this.triangleToggle = true;
    }
    return { hue, saturation, value };
  }

  updateColor(hue, saturation, value) {
    let newColor = tinycolor.fromRatio({
      h: hue,
      s: saturation,
      v: value
    });
    this.setState({
      hue,
      saturation,
      value,
      hexInput: newColor.toHex()
    });
    let rgb = newColor.toRgb();
    let ratio = {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255,
      a: rgb.a
    };

    this.props.onChange(ratio);
  }

  positionInTriangle(coord) {
    let a = this.triPT[0];

    let b = vec2.sub(vec2.create(), this.triPT[1], a);
    let c = vec2.sub(vec2.create(), this.triPT[2], a);
    let p = vec2.sub(vec2.create(), coord, a);

    let d = b[0]*c[1] - c[0]*b[1];
    let u = (p[0]*(b[1]-c[1]) + p[1]*(c[0]-b[0]) + b[0]*c[1] - c[0]*b[1])/d;
    let v = (p[0]*c[1] - p[1]*c[0])/d;
    let w = (p[1]*b[0]-p[0]*b[1])/d;

    if(!this.colorWheelToggle && (this.triangleToggle || (u > 0.0 && u < 1.0 &&
      v > 0.0 && v < 1.0 &&
      w > 0.0 && w < 1.0))) {
      return {
        u, v, w
      };
    }
    return undefined;
  }

  getTriangleCoordinateFromColor(color) {
    let v = 1.0 - color.value;
    let s = (1.0 - color.saturation) * color.value;

    let a = this.triPT[0];
    let b = this.triPT[1];
    let c = this.triPT[2];

    let v1 = vec2.sub(vec2.create(), b, a);
    let v2 = vec2.sub(vec2.create(), c, a);

    let r1 = vec2.mul(vec2.create(), v1, [s, s]);
    let r2 = vec2.mul(vec2.create(), v2, [v, v]);
    let res = vec2.add(vec2.create(), r1, r2);
    vec2.add(res, res, a);
    return res;
  }

  getClosestPointToTriangle(pos, coords) {
    let from;
    let to;
    if(pos.w + pos.v > 1.0) {
      from = this.triPT[1];
      to = this.triPT[2];
    } else if(pos.v < 0) {
      from = this.triPT[0];
      to = this.triPT[2];
    } else if(pos.w < 0) {
      from = this.triPT[0];
      to = this.triPT[1];
    }
    let line = vec2.sub(vec2.create(), from, to);
    let len = vec2.len(line);

    vec2.normalize(line, line);

    let v = vec2.sub(vec2.create(), coords, to);
    let d = vec2.dot(v, line);
    d = Math.max(0, Math.min(len, d));
    let res = vec2.scaleAndAdd(vec2.create(), to, line, d);
    return this.positionInTriangle(res);
  }

  positionInWheel(p) {
    let center = [0, 0];
    let dist = vec2.distance(p, center);
    if(!this.triangleToggle && (this.colorWheelToggle || dist > 0.8 && dist < 1.0)) {
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
    this.quad.draw(this.gl);
    this.quad.unbind(this.gl);
    this.colorWheelShader.unbind(this.gl);

    this.satValShader.bind(this.gl);
    this.triangle.bind(this.gl);

    this.triangleModel = mat4.create();
    let rot = this.state.hue * Math.PI * 2.0 - Math.PI/2.0;
    let hueRot = quat.setAxisAngle(
      quat.create(),
      [0, 0, 1],
      rot
    );
    mat4.fromRotationTranslationScale(
      this.triangleModel,
      hueRot,
      vec3.create(),
      [0.8, 0.8, 0.8]
    );
    vec2.transformMat4(this.triPT[0], this.triP[0], this.triangleModel);
    vec2.transformMat4(this.triPT[1], this.triP[1], this.triangleModel);
    vec2.transformMat4(this.triPT[2], this.triP[2], this.triangleModel);

    let mvp2 = mat4.create();
    mat4.translate(mvp2, mvp2, [0.5, 0.5, 0.0]);
    mat4.rotate(mvp2, mvp2, rot, [0, 0, 1.0]);
    mat4.scale(mvp2, mvp2, [0.8, 0.8, 0.8]);

    this.satValShader.setUniforms(this.gl, {
      mvp: this.triangleModel,
      hue: this.state.hue
    });
    this.triangle.draw(this.gl);
    this.triangle.unbind(this.gl);
    this.satValShader.unbind(this.gl);

    this.solidShader.bind(this.gl);
    this.ring.bind(this.gl);
    let pos = this.getTriangleCoordinateFromColor(this.state);

    let color = tinycolor.fromRatio({
      h: this.state.hue,
      s: this.state.saturation,
      v: this.state.value
    });
    let svMarkerColor = color.isLight()? [0.0, 0.0, 0.0, 1.0] : [1.0, 1.0, 1.0, 1.0];

    this.solidShader.setUniforms(this.gl, {
      color: svMarkerColor,
      mvp: mat4.fromRotationTranslationScale(
        mat4.create(),
        quat.create(),
        [pos[0], pos[1], 0],
        [0.03, 0.03, 1.0]
      )
    });

    this.ring.draw(this.gl);
    this.ring.unbind(this.gl);

    let hue = tinycolor.fromRatio({
      h: this.state.hue,
      s: 1.0,
      v: 1.0
    });
    let hueMarkerColor = hue.isLight()? [0.0, 0.0, 0.0, 1.0] : [1.0, 1.0, 1.0, 1.0];
    let hueMarkerMatrix = mat4.create();
    let quatMat = mat4.fromQuat(mat4.create(), hueRot);
    mat4.multiply(hueMarkerMatrix, hueMarkerMatrix, quatMat);
    mat4.translate(hueMarkerMatrix, hueMarkerMatrix, [0, 0.9, 0]);
    mat4.scale(hueMarkerMatrix, hueMarkerMatrix, [0.015, 0.1, 1.0]);
    this.quad.bind(this.gl);
    this.solidShader.setUniforms(this.gl, {
      color: hueMarkerColor,
      mvp: hueMarkerMatrix
    });

    this.quad.draw(this.gl);
    this.quad.unbind(this.gl);
    this.solidShader.unbind(this.gl);
  }

  componentWillReceiveProps(nextProps) {
    if(!this.mouseDown) {
      let color = tinycolor.fromRatio(nextProps.value);
      let currentColor = tinycolor.fromRatio(this.props.value);
      if(!tinycolor.equals(color, currentColor)) {
        let hsv = color.toHsv();
        this.setState({
          hue: hsv.h / 360,
          value: hsv.v,
          saturation: hsv.s,
          hexInput: color.toHex()
        });
      }
    }
  }

  render() {
    let color = tinycolor.fromRatio(this.props.value);
    if(this.gl !== undefined) {
      this.renderCanvas();
    }
    return (
      <div>
        <canvas
          key="color-canvas"
          onMouseDown={this.onCanvasMouseDown}
          onMouseUp={this.onCanvasMouseUp}
          width="256"
          height="256"
          className="color-input-canvas"
          ref={this.setCanvas}
        />
        <div
          key="color-display"
          className="color-input-color"
          style={{ backgroundColor: color.toHexString() }}
        >
          <input
            type="text"
            spellCheck="false"
            style={{ color: (color.isLight() ? 'black' : 'white') }}
            value={this.state.hexInput}
            onChange={this.onHexInputChange}
            onPaste={this.onHexInputChange}
          />
        </div>
      </div>
    );
  }
}

ColorSelector.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func
};

export default ColorSelector;
