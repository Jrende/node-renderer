attribute vec2 aVertexPosition;
uniform mat4 mvp;
varying float amount;

void main(void) {
  amount = clamp(aVertexPosition.x, 0.0, 1.0),
  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);
}
