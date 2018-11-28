import solidFrag from './glsl/solid.frag';
import blendTextureFrag from './glsl/blendTextureShader.frag';
import textureFrag from './glsl/textureShader.frag';
import blendFrag from './glsl/blend.frag';
import hueSaturationFrag from './glsl/hueSaturation.frag';
import brightnessContrastFrag from './glsl/brightnessContrast.frag';
import blurFrag from './glsl/blur.frag';
import gradientFrag from './glsl/gradient.frag';
import gradientVert from './glsl/gradient.vert';
import gradientTextureFrag from './glsl/gradientTextureShader.frag';
import gradientTextureVert from './glsl/gradientTextureShader.vert';
import colorMapFrag from './glsl/colorMap.frag';
import colorMapVert from './glsl/colorMap.vert';
import cloudFrag from './glsl/cloud.frag';
import genUV2D from './glsl/genUV2D.vert';
import Shader from './Shader';

function buildShader(name) {
  switch(name) {
    case 'cloud': return new Shader({ frag: cloudFrag, vert: genUV2D });
    case 'gradient': return new Shader({ frag: gradientFrag, vert: gradientVert });
    case 'texture': return new Shader({ frag: textureFrag, vert: genUV2D });
    case 'blendTexture': return new Shader({ frag: blendTextureFrag, vert: genUV2D });
    case 'gradientTexture': return new Shader({ frag: gradientTextureFrag, vert: gradientTextureVert });
    case 'colorMap': return new Shader({ frag: colorMapFrag, vert: colorMapVert });
    case 'solid': return new Shader({ frag: solidFrag, vert: genUV2D });
    case 'blur': return new Shader({ frag: blurFrag, vert: genUV2D });
    case 'blend': return new Shader({ frag: blendFrag, vert: genUV2D });
    case 'hueSaturation': return new Shader({ frag: hueSaturationFrag, vert: genUV2D });
    case 'brightnessContrast': return new Shader({ frag: brightnessContrastFrag, vert: genUV2D });
    default: return undefined;
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
