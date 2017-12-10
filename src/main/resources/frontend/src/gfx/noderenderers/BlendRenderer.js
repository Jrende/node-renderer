import Renderer from './Renderer';

export default class BlendRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('blend');
    this.textureShader = shaders.getShader('texture');
  }

  render(values, framebuffers) {
    let { left, right } = framebuffers;
    if(left === undefined) {
      left = this.placeholder.texture;
    }
    if(right === undefined) {
      right = this.placeholder.texture;
    }
    switch(values.mode) {
      case 'Normal':
        this.renderNormal(left, right, values.factor);
        break;
      case 'Multiply':
        this.renderBlend(
          this.gl.DST_COLOR,
          this.gl.ONE_MINUS_SRC_ALPHA,
          left, right, values.factor);
        break;
      case 'Screen':
        this.renderBlend(
          this.gl.SRC_ALPHA,
          this.gl.ONE_MINUS_SRC_COLOR,
          left, right, values.factor);
        break;
      default:
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
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, left);
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, right);
      this.shader.setUniforms(this.gl, {
        left: 0,
        right: 1,
        factor
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
  }

  renderBlend(srcFactor, dstFactor, left, right, opacity) {
    this.output.renderTo(this.gl, () => {
      this.textureShader.bind(this.gl);
      this.quad.bind(this.gl);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, left);
      this.textureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1.0
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.gl.blendFunc(srcFactor, dstFactor);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, right);
      this.textureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.textureShader.unbind(this.gl);
    });
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }
}
