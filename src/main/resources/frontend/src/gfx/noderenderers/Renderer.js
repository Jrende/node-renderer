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

  setFramebuffers(framebuffers) {
    let input = framebuffers || {};
    let samplers = Object.keys(this.shader.uniforms)
      .filter(key => this.shader.uniforms[key].type === 'sampler2D');
    for(let i = 0; i < samplers.length; i++) {
      let samplerName = samplers[i];
      let texture = input[samplerName];
      if(texture === undefined) {
        texture = this.placeholder.texture;
      }
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.shader.setUniforms(this.gl, {
        [samplerName]: i,
      });
    }
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.shader.bind(this.gl);
      this.quad.bind(this.gl);

      this.shader.setUniforms(this.gl, {
        res: [this.canvas.width, this.canvas.height],
        aspectRatio: this.canvas.clientWidth / this.canvas.clientHeight
      });
      this.shader.setUniforms(this.gl, values);
      this.setFramebuffers(framebuffers);
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    };
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
