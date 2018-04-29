attribute vec2 aVertexPosition;
attribute float amountIn;

uniform mat4 mvp;

varying float amount;
void main(void) {
  amount = amountIn;
  gl_Position = mvp * vec4(vec3(aVertexPosition, 1.0), 1.0);
}
