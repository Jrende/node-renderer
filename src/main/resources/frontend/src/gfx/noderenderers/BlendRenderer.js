import Renderer from './Renderer';

export default class BlendRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('blend');
    this.textureShader = shaders.getShader('nodeTexture');
  }

  render(values, framebuffers) {
    this.preRender();
    let left = this.getValue('left', values, framebuffers);
    let right = this.getValue('right', values, framebuffers);
    switch(values.mode) {
      case 'Normal':
        this.renderNormal(left, right, values.factor);
        break;
      case 'Multiply':
        this.renderBlend(
          this.gl.DST_COLOR,
          this.gl.ONE_MINUS_SRC_ALPHA,
          left, right, values.factor
        );
        break;
      case 'Screen':
        this.renderBlend(
          this.gl.SRC_ALPHA,
          this.gl.ONE_MINUS_SRC_COLOR,
          left, right, values.factor
        );
        break;
      default:
        console.error('SHOULD NOT COME HERE');
        break;
    }
    this.postRender();
    return {
      out: this.output.texture
    };
  }

  renderNormal(left, right, factor) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      left.bind(this.gl, 0);
      right.bind(this.gl, 1);
      this.shader.setUniforms(this.gl, {
        ...left.uniforms,
        ...right.uniforms,
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
      left.bind(this.gl, 0);
      this.textureShader.setUniforms(this.gl, {
        sampler: left.uniforms.leftTexture,
        connection: left.uniforms.leftConnection,
        value: left.uniforms.leftValue,
        opacity: 1.0
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.gl.blendFunc(srcFactor, dstFactor);
      right.bind(this.gl, 0);
      this.textureShader.setUniforms(this.gl, {
        sampler: right.uniforms.rightTexture,
        connection: right.uniforms.rightConnection,
        value: right.uniforms.rightValue,
        opacity
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      this.textureShader.unbind(this.gl);
    });
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }
}
