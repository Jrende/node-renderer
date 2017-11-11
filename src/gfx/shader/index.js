import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import textureFrag from './glsl/textureShader.frag';
import textureVert from './glsl/textureShader.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import cloudFrag from './glsl/cloud.frag';
import cloudVert from './glsl/cloud.vert';
import Shader from './Shader';
export default {
  cloud: new Shader({frag: cloudFrag, vert: cloudVert}),
  texture: new Shader({frag: textureFrag, vert: textureVert}),
  solid: new Shader({frag: solidFrag, vert: solidVert}),
  blur: new Shader({frag: blurFrag, vert: blurVert})
}
