attribute vec2 aVertexPosition;
attribute vec2 uvIn;
varying vec2 uv;
uniform mat4 mvp;
void main(void) {
  uv = uvIn;
  gl_Position = mvp * vec4(vec3(aVertexPosition, 0.0), 1.0);
}
