import Renderer from './Renderer';
import shaders from '../shader';
import VertexArray from '../VertexArray';
import { mat4, vec2, vec3, quat } from 'gl-matrix';

export default class GradientRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.shader = shaders.getShader('gradient');
    this.quad = new VertexArray(this.gl,
        [1, 1, 1,
         0, 1, 0,
         0, -1, 0,
         1, -1, 1],
      [1, 0, 2,
        2, 0, 3],
      [2, 1]);
  }

  render(values) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      let sum = -1.0;
      for(let i = 0; i < values.gradient.length - 1; i++) {
        let from = values.gradient[i];
        let to = values.gradient[i + 1];

        let width = to.position - from.position;
        let mvp = mat4.create();
        //mat4.translate(mvp, mvp, [-1.0, 0, 0]);
        mat4.translate(mvp, mvp, [sum, 0, 0]);
        mat4.scale(mvp, mvp, [width, 1.0, 1.0]);
        this.shader.setUniforms(this.gl, {
          mvp,
          to: this.fromColor(to.color),
          from: this.fromColor(from.color)
        });
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);


        console.log(`${i}: width: ${width}, pos: ${sum}`);
        sum += width;
      }
      console.log('');
      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    };
  }
}
