import Framebuffer from '../Framebuffer';
import VertexArray from '../VertexArray';
import Texture from '../Texture';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.canvas = this.gl.canvas;
    this.quad = new VertexArray(
      this.gl,
      [1, 1,
        -1, 1,
        -1, -1,
        1, -1],
      [1, 0, 2,
        2, 0, 3],
      [2]
    );
    this.placeholder = new Framebuffer(gl, 1, 1);
    this.placeholder.renderTo(gl, () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    this.valueTextures = {};
  }

  setSize(size) {
    this.size = size;
    if(this.output === undefined || (
      this.output.width !== size.width &&
      this.output.height !== size.height)) {
      this.output = new Framebuffer(this.gl, size.width, size.height);
    }
  }

  bindTexture(texture, unit) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  }

  getValue(name, values, framebuffers) {
    if(framebuffers[name] !== undefined) {
      return framebuffers[name];
    }
    let v = this.fromColor(values[name]);

    let texture = this.valueTextures[name];
    if(texture === undefined) {
      texture = new Texture(this.gl, [0, 0, 0, 1]);
      this.valueTextures[name] = texture;
    }

    texture.setColor(this.gl, v);
    return texture.texture;
  }

  fromColor(color) {
    let n = Number.parseFloat(color);
    if(!Number.isNaN(n)) {
      return [n, n, n, n];
    }

    return [
      color.r,
      color.g,
      color.b,
      color.a
    ];
  }
}
