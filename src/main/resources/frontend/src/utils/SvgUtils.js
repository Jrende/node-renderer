export function transformPointToSvgSpace(pos, svg, point) {
  point.x = pos[0];
  point.y = pos[1];
  let coords = point.matrixTransform(svg.getScreenCTM().inverse());
  return [coords.x, coords.y];
}

export function transformPointFromSvgSpace(pos, svg, point) {
  point.x = pos[0];
  point.y = pos[1];
  let coords = point.matrixTransform(svg.getScreenCTM());
  return [coords.x, coords.y];
}

export function addInSvgSpace(pos, add, svg, point) {
  let oldCoords = transformPointFromSvgSpace(pos, svg, point);
  point.x = oldCoords[0] + add[0];
  point.y = oldCoords[1] + add[1];
  let newCoords = point.matrixTransform(svg.getScreenCTM().inverse());
  return [newCoords.x, newCoords.y];
}

export function getSvgSize(svg) {
  let size = [0, 0];
  if(svg !== undefined) {
    let bb = svg.getBoundingClientRect();
    size = [
      bb.width,
      bb.height
    ];
  }
  return size;
}
