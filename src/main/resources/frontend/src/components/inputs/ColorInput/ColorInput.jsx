import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { mat4 } from 'gl-matrix';
import colorWheelVert from './colorWheel.vert';
import colorWheelFrag from './colorWheel.frag';
import satValVert from './satVal.vert';
import satValFrag from './satVal.frag';
import VertexArray from '../../../gfx/VertexArray';
import Shader from '../../../gfx/shader/Shader';
import './style.less';

class ColorInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.setCanvas = this.setCanvas.bind(this);
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
      [1, 1,
        -1, 1,
        -1, -1,
        1, -1],
      [1, 0, 2,
        2, 0, 3],
      [2]);
    this.triangle = new VertexArray(this.gl,
      [0, 1.0, 1.0, 1.0,
        -0.8660253882408142, -0.5, 0.0, 1.0,
        0.8660253882408142, -0.4999999701976776, 1.0, 0.0],
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

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  renderCanvas(color) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.quad.bind(this.gl);


    let resolution = [
      this.canvas.clientWidth,
      this.canvas.clientHeight
    ]
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
    let { name, type, value } = this.props;
    let color = tinycolor(value);
    if(this.gl !== undefined) {
      this.renderCanvas(color);
    }
    return (
      <fieldset>
        <canvas width="256" height="256" className="color-input-canvas" ref={this.setCanvas} />
      </fieldset>
    );
  }
}

ColorInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func
};

export default ColorInput;
