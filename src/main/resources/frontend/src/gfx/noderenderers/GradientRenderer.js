import { mat4, vec2, vec3, quat } from 'gl-matrix';
import Renderer from './Renderer';
import VertexArray from '../VertexArray';
import Framebuffer from '../Framebuffer';

function getAngle(v1, v2) {
  let v1n = vec2.normalize(vec2.create(), v1);
  let v2n = vec2.normalize(vec2.create(), v2);
  let dot = vec2.dot(v1n, v2n);
  let det = v1n[0]*v2n[1] - v1n[1]*v2n[0];
  let rad = Math.atan2(det, dot);
  if(rad < 0) {
    rad += 2*Math.PI;
  }
  return rad;
}

export default class GradientRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.shader = shaders.getShader('gradient');
    this.gradientTextureShader = shaders.getShader('gradientTexture');
    this.buffer = new Framebuffer(this.gl, this.canvas.width, this.canvas.height);
    this.quad = new VertexArray(
      this.gl,
      [
        0, 0,
        0, 1,
        1, 0,
        1, 1,
      ],
      [
        0, 1, 3,
        2, 3, 0
      ],
      [2]
    );
    this.wrapMode = 'Repeat';
  }

  renderGradient(gradient) {
    let sum = -1.0;
    for(let i = 0; i < gradient.length - 1; i++) {
      let from = gradient[i];
      let to = gradient[i + 1];
      let width = (to.position - from.position) * 2;
      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [sum, -1.0, 0]);
      mat4.scale(mvp, mvp, [width, 2.0, 1.0]);
      this.shader.setUniforms(this.gl, {
        mvp,
        to: this.fromColor(to.color),
        from: this.fromColor(from.color)
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      sum += width;
    }
  }

  render(values) {
    if(values.repeat !== this.wrap) {
      this.wrapMode = values.repeat;
      let wrap;
      switch(values.repeat) {
        case 'Repeat': wrap = this.gl.REPEAT; break;
        case 'Mirrored repeat': wrap = this.gl.MIRRORED_REPEAT; break;
        case 'Clamp to edge': wrap = this.gl.CLAMP_TO_EDGE; break;
        default: wrap = this.gl.REPEAT;
      }
      // TODO: Maybe clean up the previous buffer?
      // Also, maybe lazy-create it. Only 3 possible values.
      this.buffer = new Framebuffer(this.gl, this.canvas.width, this.canvas.height, { wrap });
    }
    this.buffer.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.shader.bind(this.gl);
      this.quad.bind(this.gl);
      this.renderGradient(values.gradient);
      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
    
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gradientTextureShader.bind(this.gl);
      this.quad.bind(this.gl);

      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.buffer.texture);

      let from = values.vector[0];
      let to = values.vector[1];
      let midpoint = vec2.create();
      vec2.add(midpoint, from, to);
      vec2.scale(midpoint, midpoint, 0.5);
      let dir = vec2.sub(vec2.create(), to, from);

      let len = 1.0/vec2.distance(from, to);
      let angle = getAngle(dir, [1, 0]);

      let uvMvp = mat4.create();
      //mat4.translate(uvMvp, uvMvp, [-1.0, -1.0, 0.0]);
      //mat4.scale(uvMvp, uvMvp, [1.0/dir[0], 1.0/dir[1], 1.0]);
      mat4.translate(uvMvp, uvMvp, [-midpoint[0] + 0.5, -midpoint[1], 0.0]);
      mat4.scale(uvMvp, uvMvp, [len, len, 1.0]);
      mat4.rotate(uvMvp, uvMvp, -angle, [0, 0, 1.0]);

      let mvp = mat4.create();
      mat4.translate(mvp, mvp, [-1.0, -1.0, 0]);
      mat4.scale(mvp, mvp, [2.0, 2.0, 1.0]);
      this.gradientTextureShader.setUniforms(this.gl, {
        sampler: 0,
        opacity: 1.0,
        uvMvp,
        mvp
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

      this.quad.unbind(this.gl);
      this.gradientTextureShader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    };
  }
}
