import Renderer from './Renderer';

export default class CloudRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('hueSaturation');
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      let input = framebuffers.input;
      if(input === undefined) {
        input = this.placeholder.input;
      }
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, input);
      this.quad.bind(this.gl);
      this.shader.setUniforms(this.gl, {
        sampler: 0,
        hue: values.hue,
        saturation: values.saturation,
        lightness: values.lightness
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
