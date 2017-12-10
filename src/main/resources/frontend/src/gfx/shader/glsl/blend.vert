attribute vec2 aVertexPosition;
varying vec2 uv;
void main(void) {
  uv = vec2(
    clamp(aVertexPosition.x, 0.0, 1.0),
    clamp(aVertexPosition.y, 0.0, 1.0)
  );
  gl_Position = vec4(vec3(aVertexPosition, 0.0), 1.0);
}
