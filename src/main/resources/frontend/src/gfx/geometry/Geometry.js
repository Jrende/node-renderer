export default class Geometry {
  bind(gl) {
    this.geometry.bind(gl);
  }

  unbind(gl) {
    this.geometry.bind(gl);
  }

  draw(gl) {
    this.geometry.draw(gl);
  }
}
