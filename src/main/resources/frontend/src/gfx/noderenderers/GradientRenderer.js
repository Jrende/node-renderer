import { mat4, vec2, vec3, quat } from 'gl-matrix';
import Renderer from './Renderer';
import VertexArray from '../VertexArray';
import Framebuffer from '../Framebuffer';

export default class GradientRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.shader = shaders.getShader('gradient');
    this.gradientTextureShader = shaders.getShader('gradientTexture');
    this.buffer = new Framebuffer(this.gl, this.canvas.width, this.canvas.height);
    this.quad = new VertexArray(
      this.gl,
      [1, 1, 1,
        0, 1, 0,
        0, -1, 0,
        1, -1, 1],
      [1, 0, 2, 2, 0, 3],
      [2, 1]
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

      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [-1.0, 0, 0]);
      mat4.scale(mvp, mvp, [2.0, 1.0, 1.0]);
      this.gradientTextureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1.0,
        mvp
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
