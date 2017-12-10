/* global gl */

export default class Camera {
  constructor(pos, dir) {
    this.up = [0, 1, 0];
    this.pos = pos;
    this.dir = dir;
    this.viewMat = lookat(this.pos, this.pos + this.dir, this.up);
  }

  getViewMatrix() {
    return this.viewMat;
  }

}
