import Renderer from './Renderer';

export default class BrightnessContrastRenderer extends Renderer {
  constructor(gl, shaders) {
    super(gl);
    this.shader = shaders.getShader('brightnessContrast');
  }
}
