import Renderer from './Renderer';

export default class HueSaturationRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('hueSaturation');
  }
}
