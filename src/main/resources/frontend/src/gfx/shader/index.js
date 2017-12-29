import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import textureFrag from './glsl/textureShader.frag';
import textureVert from './glsl/textureShader.vert';
import blendFrag from './glsl/blend.frag';
import blendVert from './glsl/blend.vert';
import hueSaturationFrag from './glsl/hueSaturation.frag';
import hueSaturationVert from './glsl/hueSaturation.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import cloudFrag from './glsl/cloud.frag';
import cloudVert from './glsl/cloud.vert';
import Shader from './Shader';

function buildShader(name) {
  switch(name) {
    case "cloud": return new Shader({frag: cloudFrag, vert: cloudVert});
    case "texture": return new Shader({frag: textureFrag, vert: textureVert});
    case "solid": return new Shader({frag: solidFrag, vert: solidVert});
    case "blur": return new Shader({frag: blurFrag, vert: blurVert});
    case "blend": return new Shader({frag: blendFrag, vert: blendVert});
    case "hueSaturation": return new Shader({frag: hueSaturationFrag, vert: hueSaturationVert});
  }
}

export default class ShaderBuilder {
  constructor(gl) {
    this.gl = gl;
    this.shaderCache = {};
  }

  getShader(shaderName) {
    let shader = this.shaderCache[shaderName];
    if(shader === undefined) {
      shader = buildShader(shaderName);
      shader.compile(this.gl);
      this.shaderCache[shaderName] = shader;
    }
    return shader;
  }
}
