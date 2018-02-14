import VertexArray from '../VertexArray';
import Geometry from './Geometry';

function generateGeometry(gl, numPoints, innerRadius) {
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
  return new VertexArray(gl, points, indices, [3], gl.TRIANGLES);
}

export default class Ring extends Geometry {
  constructor(gl, points = 6, innerRadius = 0.5) {
    super();
    this.points = points;
    this.geometry = generateGeometry(gl, points, innerRadius);
  }
}
