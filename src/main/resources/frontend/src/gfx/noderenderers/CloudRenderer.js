import Renderer from './Renderer';

export default class CloudRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('cloud');
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      let left = 0;
      if(values.left !== undefined) {
        left = values.left;
      }
      this.shader.setUniforms(this.gl, {
        res: [this.canvas.width, this.canvas.height],
        left,
        aspectRatio: this.canvas.clientWidth / this.canvas.clientHeight,
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
    };
  }
}
