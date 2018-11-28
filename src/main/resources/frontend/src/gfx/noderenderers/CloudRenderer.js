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

      let density = this.getValue('density', values, framebuffers, this.densityTexture);

      this.bindTexture(density, 0);

      this.shader.setUniforms(this.gl, {
        res: [this.size.width, this.size.height],
        aspectRatio: this.size.width / this.size.height,
        seed: 0,
        left: values.left,
        size: values.size,
        density: 0
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
