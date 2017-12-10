import VertexArray from '../VertexArray';
import { radToDeg } from '../Utils.js';
/* global gl */

function generateGeometry(numPoints, innerRadius) {
  let points = [0, 0, 0];
  let indices = [];
  for(let i = 0; i < (numPoints + 1) * 2; i++) {
    let rad = (Math.PI / numPoints) * i;
    let justify = [
      ((1.0 - innerRadius) / 2) * Math.sin(rad),
      (1.0 - innerRadius) / 2 * Math.cos(rad)
    ];

    if(i % 2 === 0) {
      points.push(Math.sin(rad) + justify[0]);
      points.push(Math.cos(rad) + justify[1]);
    } else {
      points.push(Math.sin(rad) * innerRadius + justify[0]);
      points.push(Math.cos(rad) * innerRadius + justify[1]);
    }
    points.push(0);
  }

  for(let i = 0; i < numPoints; i++) {
    [3, 2, 1, 3, 4, 2]
      .map(n => n + i*2)
      .forEach(n => indices.push(n));
  }
  return new VertexArray(points, indices, [3], gl.TRIANGLES);
}

export default class Line {
  constructor(points = 6, innerRadius = 0.5) {
    this.points = points;

    this.vertexArray = generateGeometry(points, innerRadius);
  }

  addToWorld(world, material) {
    let child = world.createChild();
    child.material = material;
    child.geometry = this.vertexArray;
  }
}
