import VertexArray from '../VertexArray';
export default class Triangles {
  constructor(points) {
    let vertices = [];
    let indices = [];
    for(let i = 0; i < points.length; i++) {
      points[i].forEach(p => vertices.push(p));
      indices.push(i);
    }
    this.geometry = new VertexArray(vertices, indices, [3], gl.TRIANGLES);
  }

  addToWorld(world, material) {
    let child = world.createChild();
    child.material = material;
    child.geometry = this.geometry;
  }
}
