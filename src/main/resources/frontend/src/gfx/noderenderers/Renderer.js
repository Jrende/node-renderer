import Framebuffer from '../Framebuffer';
import VertexArray from '../VertexArray';

class TextureValue {
  constructor(name, framebuffer) {
    this.uniforms = {
      [`${name}Connection`]: true,
      [`${name}Value`]: [0, 0, 0, 0]
    };
    this.framebuffer = framebuffer;
    this.name = name;
  }

  bind(gl, index) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer);
    this.uniforms[`${this.name}Texture`] = index;
  }
}


class PrimitiveValue {
  constructor(name, placeholder, value) {
    this.uniforms = {
      [`${name}Connection`]: false,
      [`${name}Value`]: value
    };
    this.placeholder = placeholder;
    this.name = name;
  }

  bind(gl, index) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, this.placeholder);
    this.uniforms[`${this.name}Texture`] = index;
  }
}

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.canvas = this.gl.canvas;
    this.quad = new VertexArray(
      this.gl,
      [1, 1,
        -1, 1,
        -1, -1,
        1, -1],
      [1, 0, 2,
        2, 0, 3],
      [2]
    );
    this.placeholder = new Framebuffer(gl, 1, 1);
    this.placeholder.renderTo(gl, () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
  }

  setFramebuffers(framebuffers) {
    let input = framebuffers || {};
    let samplers = Object.keys(this.shader.uniforms)
      .filter(key => this.shader.uniforms[key].type === 'sampler2D');
    for(let i = 0; i < samplers.length; i++) {
      let samplerName = samplers[i];
      let texture = input[samplerName];
      if(texture === undefined) {
        texture = this.placeholder.texture;
      }
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.shader.setUniforms(this.gl, {
        [samplerName]: i,
      });
    }
  }

  setSize(size) {
    this.size = size;
    if(this.output === undefined || (
      this.output.width !== size.width &&
      this.output.height !== size.height)) {
      this.output = new Framebuffer(this.gl, size.width, size.height);
    }
  }

  getValue(name, values, framebuffers) {
    if(framebuffers[name] !== undefined) {
      return new TextureValue(name, framebuffers[name]);
    }
    return new PrimitiveValue(name, this.placeholder.texture, this.fromColor(values[name]));
  }

  preRender() {
    this.boundTexture = -1;
  }

  postRender() {
  }

  render(values, framebuffers) {
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.shader.bind(this.gl);
      this.quad.bind(this.gl);

      this.shader.setUniforms(this.gl, {
        res: [this.size.width, this.size.height],
        aspectRatio: this.size.width / this.size.height
      });
      this.shader.setUniforms(this.gl, values);
      this.setFramebuffers(framebuffers);
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

      this.quad.unbind(this.gl);
      this.shader.unbind(this.gl);
    });
    return {
      out: this.output.texture
    };
  }

  fromColor(color) {
    return [
      color.r,
      color.g,
      color.b,
      color.a
    ];
  }
}
