import Framebuffer from '../Framebuffer.js';
import VertexArray from '../VertexArray.js';

let quad = undefined;
export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.canvas = this.gl.canvas;
    this.output = new Framebuffer(this.gl, this.canvas.width, this.canvas.height, false, false);
    if(quad === undefined) {
      quad = new VertexArray(this.gl,
        [1, 1,
          -1, 1,
          -1, -1,
          1, -1],
        [1, 0, 2,
          2, 0, 3],
        [2]);
    }
    this.quad = quad;
  }

  fromColor(color) {
    return [
      color.r / 255,
      color.g / 255,
      color.b / 255,
      color.a / 255
    ]
  }
}
