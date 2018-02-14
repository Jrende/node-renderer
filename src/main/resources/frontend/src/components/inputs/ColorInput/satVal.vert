attribute vec2 aVertexPosition;
attribute vec2 uvAttr;

varying vec2 uv;
uniform mat4 mvp;

void main(void) {
  uv = uvAttr;
  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);
}

