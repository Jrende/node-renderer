attribute vec2 aVertexPosition;
attribute vec3 barycentric;

varying vec3 uvw;
uniform mat4 mvp;

void main(void) {
  uvw = barycentric;
  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);
}

