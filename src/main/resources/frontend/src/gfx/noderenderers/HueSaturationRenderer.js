import Renderer from './Renderer';

export default class HueSaturationRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('hueSaturation');
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.shader.bind(this.gl);
      this.quad.bind(this.gl);

      let color = this.getValue('inputTexture', values, framebuffers, this.hueTexture);

      let hue = this.getValue('hue', values, framebuffers, this.hueTexture);
      let saturation = this.getValue('saturation', values, framebuffers, this.saturationTexture);
      let lightness = this.getValue('lightness', values, framebuffers, this.lightnessTexture);
      this.bindTexture(hue, 0);
      this.bindTexture(saturation, 1);
      this.bindTexture(lightness, 2);
      this.bindTexture(color, 3);

      this.shader.setUniforms(this.gl, {
        hue: 0,
        saturation: 1,
        lightness: 2,
        inputTexture: 3
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
