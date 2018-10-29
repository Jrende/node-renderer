attribute vec2 aVertexPosition;
uniform mat4 mvp;
void main(void) {
  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);
}
