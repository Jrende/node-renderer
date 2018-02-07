import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import colorWheelVert from './colorWheel.vert';
import colorWheelFrag from './colorWheel.frag';
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
    this.quad = new VertexArray(this.gl,
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [1, 0, 2,
        2, 0, 3],
      [3]);
    this.gl.clearColor(0, 0, 0, 1.0);
    this.renderCanvas(this.props.color);
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
    this.colorWheelShader.bind(this.gl);
    this.colorWheelShader.setUniforms(this.gl, {
      resolution: [
        this.canvas.clientWidth,
        this.canvas.clientHeight
      ]
    });
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    this.quad.unbind(this.gl);
    this.colorWheelShader.unbind(this.gl);
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
