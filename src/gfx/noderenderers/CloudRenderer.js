import shaders from '../shader';
import Framebuffer from '../Framebuffer.js';
import VertexArray from '../VertexArray.js';
let shader = shaders.cloud;
export default class CloudRenderer {
  constructor(gl) {
    this.gl = gl;
    this.shader = shader;
    this.shader.compile(gl);
    let elm = this.gl.canvas;
    this.output = new Framebuffer(this.gl, elm.width, elm.height, false, false);
    this.quad = new VertexArray(this.gl,
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [1, 0, 2,
        2, 0, 3],
      [3]);
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.shader.setUniforms(this.gl, {
        res: [1024, 1024],
        seed: 1231,
        size: 10,
        density: 1,
        left: 1,
        color: [1.0, 1.0, 1.0]
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    }
  }
}
