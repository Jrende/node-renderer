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

