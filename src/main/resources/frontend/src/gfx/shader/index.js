import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import textureFrag from './glsl/textureShader.frag';
import textureVert from './glsl/textureShader.vert';
import blendFrag from './glsl/blend.frag';
import blendVert from './glsl/blend.vert';
import hueSaturationFrag from './glsl/hueSaturation.frag';
import hueSaturationVert from './glsl/hueSaturation.vert';
import brightnessContrastFrag from './glsl/brightnessContrast.frag';
import brightnessContrastVert from './glsl/brightnessContrast.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import gradientFrag from './glsl/gradient.frag';
import gradientVert from './glsl/gradient.vert';
import gradientTextureFrag from './glsl/gradientTextureShader.frag';
import gradientTextureVert from './glsl/gradientTextureShader.vert';
import colorMapFrag from './glsl/colorMap.frag';
import colorMapVert from './glsl/colorMap.vert';
import cloudFrag from './glsl/cloud.frag';
import cloudVert from './glsl/cloud.vert';
import Shader from './Shader';

function buildShader(name) {
  switch(name) {
    case 'cloud': return new Shader({ frag: cloudFrag, vert: cloudVert });
    case 'gradient': return new Shader({ frag: gradientFrag, vert: gradientVert });
    case 'texture': return new Shader({ frag: textureFrag, vert: textureVert });
    case 'gradientTexture': return new Shader({ frag: gradientTextureFrag, vert: gradientTextureVert });
    case 'colorMap': return new Shader({ frag: colorMapFrag, vert: colorMapVert });
    case 'solid': return new Shader({ frag: solidFrag, vert: solidVert });
    case 'blur': return new Shader({ frag: blurFrag, vert: blurVert });
    case 'blend': return new Shader({ frag: blendFrag, vert: blendVert });
    case 'hueSaturation': return new Shader({ frag: hueSaturationFrag, vert: hueSaturationVert });
    case 'brightnessContrast': return new Shader({ frag: brightnessContrastFrag, vert: brightnessContrastVert });
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
