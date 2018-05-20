import Renderer from './Renderer';

export default class CloudRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.gl = gl;
    this.shader = shaders.getShader('cloud');
  }
}
