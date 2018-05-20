attribute vec2 aVertexPosition;
attribute vec2 uvIn;
varying vec2 uv;
uniform mat4 mvp;
uniform mat4 uvMvp;
void main(void) {
  uv = (uvMvp * vec4(vec3(uvIn, 0.0), 1.0)).xy;
  gl_Position = mvp * vec4(vec3(aVertexPosition, 0.0), 1.0);
}
