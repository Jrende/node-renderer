import { mat4, vec2, vec3, quat } from 'gl-matrix';
import Renderer from './Renderer';
import VertexArray from '../VertexArray';
import Framebuffer from '../Framebuffer';

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

export default class GradientRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gradientShader = shaders.getShader('gradient');
    this.colorMapShader = shaders.getShader('colorMap');
    this.gradientBuffer = new Framebuffer(this.gl, this.canvas.width, this.canvas.height);
    this.quad = new VertexArray(
      this.gl,
      [
        0, 0,
        0, 1,
        1, 0,
        1, 1,
      ],
      [
        0, 1, 3,
        2, 3, 0
      ],
      [2]
    );
  }

  renderGradient(gradient) {
    let sum = -1.0;
    for(let i = 0; i < gradient.length - 1; i++) {
      let from = gradient[i];
      let to = gradient[i + 1];
      let width = (to.position - from.position) * 2;
      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [sum, -1.0, 0]);
      mat4.scale(mvp, mvp, [width, 2.0, 1.0]);
      this.gradientShader.setUniforms(this.gl, {
        mvp,
        to: this.fromColor(to.color),
        from: this.fromColor(from.color)
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      sum += width;
    }
  }

  render(values, framebuffers) {
    let { inputTexture } = framebuffers;
    if(inputTexture === undefined) {
      inputTexture = this.placeholder.texture;
    }
    this.gradientBuffer.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gradientShader.bind(this.gl);
      this.quad.bind(this.gl);
      this.renderGradient(values.gradient);
      this.quad.unbind(this.gl);
      this.gradientShader.unbind(this.gl);
    });
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.colorMapShader.bind(this.gl);
      this.quad.bind(this.gl);
      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [-1.0, -1.0, 0]);
      mat4.scale(mvp, mvp, [2.0, 2.0, 1.0]);

      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.gradientBuffer.texture);

      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture);
      this.colorMapShader.setUniforms(this.gl, {
        mvp,
        gradient: 0,
        inputTexture: 1
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.colorMapShader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    };
  }
}
