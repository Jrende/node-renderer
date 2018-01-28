import Framebuffer from '../Framebuffer';
import VertexArray from '../VertexArray';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.canvas = this.gl.canvas;
    this.output = new Framebuffer(this.gl, this.canvas.width, this.canvas.height, false, false);
    this.quad = new VertexArray(this.gl,
      [1, 1,
        -1, 1,
        -1, -1,
        1, -1],
      [1, 0, 2,
        2, 0, 3],
      [2]);
    this.placeholder = new Framebuffer(gl, 1, 1, false, false);
    this.placeholder.renderTo(gl, () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.renderBegin(framebuffers);
      this.shader.setUniforms(this.gl, values);
      this.renderEnd(framebuffers);
    });

    return {
      out: this.output.texture
    };
  }

  renderBegin(framebuffers) {
    this.shader.bind(this.gl);
    let input = framebuffers.input;
    if(input === undefined) {
      input = this.placeholder.input;
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, input);
      this.shader.setUniforms(this.gl, {
        sampler: 0,
      });
    }
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.quad.bind(this.gl);
  }

  renderEnd(framebuffers) {
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    this.quad.unbind(this.gl);
    this.shader.unbind(this.gl);
  }

  fromColor(color) {
    return [
      color.r / 255,
      color.g / 255,
      color.b / 255,
      color.a
    ];
  }
}
