import Renderer from './Renderer';
import shaders from '../shader';
export default class CloudRenderer extends Renderer {
  constructor(gl) {
    super(gl);
    this.shader = shaders.solid;
    this.shader.compile(gl);
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.shader.setUniforms(this.gl, {
        color: this.fromColor(values.color),
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
