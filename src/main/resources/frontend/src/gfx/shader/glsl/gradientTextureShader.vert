attribute vec2 aVertexPosition;
varying vec2 uv;
uniform mat4 uvMvp;
uniform mat4 mvp;
void main(void) {
  uv = (uvMvp * vec4(
    clamp(aVertexPosition.x, 0.0, 1.0),
    clamp(aVertexPosition.y, 0.0, 1.0),
    0.0,
    1.0
  )).xy;
  gl_Position = mvp * vec4(vec2(aVertexPosition), 0.0, 1.0);
}
