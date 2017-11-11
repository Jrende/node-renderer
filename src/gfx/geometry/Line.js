import Quad from './Quad';

export default class Line {
  constructor(from, to, width = 5) {
    this.from = from;
    this.to = to;
    this.width = width;
    if(this.from.length === 2) {
      this.from[2] = 0.0;
    }
    if(this.to.length === 2) {
      this.to[2] = 0.0;
    }
  }

  addToWorld(world, material) {
    let midpoint = [
      (this.to[0]+this.from[0]),
      (this.to[1]+this.from[1]),
      (this.to[2]+this.from[2])
    ].map(i => i/2.0);
    let p = [
      this.to[0] - this.from[0],
      this.to[1] - this.from[1],
      this.to[2] - this.from[2]
    ];
    let len = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    let angle = -Math.atan(p[0]/p[1]);

    let child = world.createChild();
    child.material = material;
    child.geometry = Quad.geometry;
    child.translate(midpoint);
    child.rotate(angle, [0, 0, 1]);
    child.scale([this.width, len/2.0, 1]);
  }
}
