import shaders from '../shader';
import Material from './Material';

export default class SolidMaterial extends Material {
  constructor(color) {
    super();
    this.shader = shaders.solid;
    this.color = color;
    if(color[3] === undefined) {
      color[3] = 1.0;
    } else {
      //Should I premultiply alpha here, or in shader?
      color[0] *= color[3];
      color[1] *= color[3];
      color[2] *= color[3];
    }
  }

  apply() {
    this.shader.setUniforms({
      color: this.color
    });
  }

  isTransparent() {
    return this.color[3] < 1.0;
  }
}

