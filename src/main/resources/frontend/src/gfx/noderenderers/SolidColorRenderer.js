import Renderer from './Renderer';

export default class SolidColorRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.shader = shaders.getShader('texture');
  }

  render(values, framebuffers) {
    let left = this.getValue('color', values, framebuffers);
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.bindTexture(left, 0);
      this.shader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1.0
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
