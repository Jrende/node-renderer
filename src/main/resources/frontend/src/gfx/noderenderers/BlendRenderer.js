import Renderer from './Renderer';
import Texture from '../Texture';

export default class BlendRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('blend');
    this.whiteColor = new Texture(gl, [1, 1, 1, 1]);
    this.blendTextureShader = shaders.getShader('blendTexture');
  }

  render(values, framebuffers) {
    let left = this.getValue('left', values, framebuffers, this.leftTexture);
    let right = this.getValue('right', values, framebuffers, this.rightTexture);
    let factor = this.getValue('factor', values, framebuffers, this.factorTexture);
    switch(values.mode) {
      case 'Normal':
        this.renderNormal(left, right, factor);
        break;
      case 'Multiply':
        this.renderBlend(
          this.gl.DST_COLOR,
          this.gl.ONE_MINUS_SRC_ALPHA,
          left, right, factor
        );
        break;
      case 'Screen':
        this.renderBlend(
          this.gl.SRC_ALPHA,
          this.gl.ONE_MINUS_SRC_COLOR,
          left, right, factor
        );
        break;
      default:
        console.error('SHOULD NOT COME HERE');
        break;
    }
    return {
      out: this.output.texture
    };
  }

  renderNormal(left, right, factor) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.bindTexture(left, 0);
      this.bindTexture(right, 1);
      this.bindTexture(factor, 2);
      this.shader.setUniforms(this.gl, {
        left: 0,
        right: 1,
        factor: 2
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
  }

  renderBlend(srcFactor, dstFactor, left, right, opacity) {
    this.output.renderTo(this.gl, () => {
      this.blendTextureShader.bind(this.gl);
      this.quad.bind(this.gl);
      this.bindTexture(left, 0);
      this.whiteColor.bind(this.gl, 1);
      this.blendTextureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.gl.blendFunc(srcFactor, dstFactor);
      this.bindTexture(right, 0);
      this.bindTexture(opacity, 1);
      this.blendTextureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.blendTextureShader.unbind(this.gl);
    });
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }
}
