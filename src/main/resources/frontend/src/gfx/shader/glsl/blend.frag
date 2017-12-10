precision highp float;
varying vec2 uv;

uniform sampler2D left;
uniform sampler2D right;
uniform float factor;

void main() {
  vec4 leftColor = texture2D(left, uv);
  vec4 rightColor = texture2D(right, uv);
  vec4 finalColor = factor * leftColor + (1.0 - factor) * rightColor;
  gl_FragColor = finalColor;
}
