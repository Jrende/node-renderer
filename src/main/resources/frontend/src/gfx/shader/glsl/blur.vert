attribute vec2 aVertexPosition;
varying vec2 vTexCoord;
void main(void) {
  vTexCoord = vec2(
    clamp(aVertexPosition.x, 0.0, 1.0),
    clamp(aVertexPosition.y, 0.0, 1.0)
  );
  gl_Position = vec4(vec3(aVertexPosition, 0.0), 1.0);
}
