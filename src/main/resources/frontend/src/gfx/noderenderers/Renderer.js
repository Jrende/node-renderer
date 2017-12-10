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


  fromColor(color) {
    return [
      color.r / 255,
      color.g / 255,
      color.b / 255,
      color.a
    ];
  }
}
