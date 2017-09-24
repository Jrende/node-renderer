export function findNode(graph, nodeId) {
  for(let i = 0; i < graph.length; i++) {
    let item = findNodeRecursive(graph[i], nodeId);
    if(item != null) {
      return item;
    }
  }
  return null;
}

export function findNodeRecursive(graph, nodeId) {
  if(graph.id === nodeId) {
    return graph;
  }
  if(graph.input == null) {
    return null;
  }
  let children = Object.keys(graph.input);
  for(let i = 0; i < children.length; i++) {
    let item = findNode(graph.input[children[i]], nodeId);
    if(item != null) {
      return item;
    }
  }
  return null;
}

let point = null;
export function transformPointToSvgSpace(pos, svg) {
  if(point == null) {
    point = svg.createSVGPoint();
  }
  point.x = pos[0];
  point.y = pos[1];
  let coords = point.matrixTransform(svg.getScreenCTM().inverse());
  return [coords.x, coords.y];
}

export function transformPointFromSvgSpace(pos, svg) {
  if(point == null) {
    point = svg.createSVGPoint();
  }
  point.x = pos[0];
  point.y = pos[1];
  let coords = point.matrixTransform(svg.getScreenCTM());
  return [coords.x, coords.y];
}

export function addInSvgSpace(pos, add, svg) {
  if(point == null) {
    point = svg.createSVGPoint();
  }

  let oldCoords = transformPointFromSvgSpace(pos, svg);
  point.x = oldCoords[0] + add[0];
  point.y = oldCoords[1] + add[1];
  let newCoords = point.matrixTransform(svg.getScreenCTM().inverse());
  return [newCoords.x, newCoords.y];
}
