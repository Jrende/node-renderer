import shaders from '../shader';
import Framebuffer from '../Framebuffer.js';
import VertexArray from '../VertexArray.js';
export default class CloudRenderer {
  constructor(gl) {
    this.gl = gl;
    this.shader = shaders.cloud;
    this.shader.compile(gl);
    this.canvas = gl.canvas;
    this.output = new Framebuffer(this.gl, this.canvas.width, this.canvas.height, false, false);
    this.quad = new VertexArray(this.gl,
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [1, 0, 2,
        2, 0, 3],
      [3]);
  }

  /*
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      shaders.cloud.bind(this.gl);
      this.quad.bind(this.gl);
      shaders.cloud.setUniforms(this.gl, {
        seed: 1231,
        size: 1000,
        density: 1,
        left: 1,
        color: [1.0, 1.0, 1.0]
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      shaders.cloud.unbind(this.gl);
    });
  */
   
  render(values, framebuffers) {
    //{seed: 0, size: "6", density: 0, left: "5", color: "Black"}
    console.log("values: ", values);
    this.output.renderTo(this.gl, () => {
      //Might not need to clear depth buffer
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.shader.setUniforms(this.gl, {
        res: [this.canvas.width, this.canvas.height],
        seed: values.seed,
        size: values.size,
        density: values.density,
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
