attribute vec2 aVertexPosition;
uniform mat4 mvp;
varying float amount;
varying vec2 uv;
void main(void) {
  uv = vec2(
      clamp(aVertexPosition.x, 0.0, 1.0),
      clamp(aVertexPosition.y, 0.0, 1.0)
      );
  amount = clamp(aVertexPosition.x, 0.0, 1.0);
  gl_Position = mvp * vec4(vec2(aVertexPosition), 1.0, 1.0);
}
