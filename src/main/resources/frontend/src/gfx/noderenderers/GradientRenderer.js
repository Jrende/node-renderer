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
    this.shader = shaders.getShader('gradient');
    this.gradientTextureShader = shaders.getShader('gradientTexture');
    this.options = {
    };
    this.buffer = new Framebuffer(this.gl, this.canvas.width, this.canvas.height, this.options);
    this.quad = new VertexArray(
      this.gl,
      [ 
        1, 1, 1, 1,
        -1, 1, 0, 1,
        -1, -1, 0, 0,
        1, -1, 1, 0],
      [1, 0, 2, 2, 0, 3],
      [2, 2]
    );
  }

  renderGradient(gradient) {
    let sum = -1.0;
    for(let i = 0; i < gradient.length - 1; i++) {
      let from = gradient[i];
      let to = gradient[i + 1];
      let width = (to.position - from.position) * 2.0;
      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [sum, 0, 0]);
      mat4.scale(mvp, mvp, [width, 1.0, 1.0]);
      this.shader.setUniforms(this.gl, {
        mvp,
        to: this.fromColor(to.color),
        from: this.fromColor(from.color)
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      sum += width;
    }
  }

  render(values) {
    this.buffer.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.renderGradient(values.gradient);
      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gradientTextureShader.bind(this.gl);
      this.quad.bind(this.gl);

      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.buffer.texture);

      let from = values.vector[0];
      let to = values.vector[1];
      let midpoint = vec2.create();
      vec2.add(midpoint, from, to);
      vec2.scale(midpoint, midpoint, 0.5);
      let dir = vec2.sub(vec2.create(), to, from);
      vec2.normalize(dir, dir);

      let len = 1.0/vec2.distance(from, to);
      let angle = getAngle(dir, [1, 0]);

      let uvMvp = mat4.create();
      mat4.scale(uvMvp, uvMvp, [len, len, 1.0]);
      mat4.translate(uvMvp, uvMvp, [0.5 - midpoint[0], -midpoint[1], 0.0]);
      mat4.rotate(uvMvp, uvMvp, -angle, [0, 0, 1.0]);

      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [-1.0, 0, 0]);
      mat4.scale(mvp, mvp, [2.0, 1.0, 1.0]);
      this.gradientTextureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1.0,
        mvp,
        uvMvp
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

      this.quad.unbind(this.gl);
      this.gradientTextureShader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    };
  }
}
