import VertexArray from '../VertexArray';

function getDetailPoints(from, to, iteration, points = []) {
  if(iteration <= 0) {
    //move point by normal
    let newPoint = [0, 0, 0];
    points.push(newPoint);
  } else {
    let mid = [
      (to[0]+from[0]),
      (to[1]+from[1]),
      (to[2]+from[2])
    ].map(i => i/2.0);
    getDetailPoints(from, mid, iteration - 1, points);
    getDetailPoints(mid, to, iteration - 1, points);
  }
  return points;
}

export default class Blot {
  constructor(points, detail) {
    //call getDetailPoints with points
    let geometry = [];
    for(let i = 0; i < points.length; i++) {
      let arr = getDetailPoints(points[i], points[(i + 1) % points.length], detail);
      arr.forEach(v => geometry.push(v));
    }
    this.vertexArray = new VertexArray();
  }

  addToWorld(world, material) {
    world.material = material;
    world.geometry = this.geometry;
  }
}
