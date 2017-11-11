precision highp float;
uniform sampler2D left;
uniform sampler2D right;
varying vec2 uv;

void main(void) {
  gl_FragColor = texture2D(left, uv) + texture2D(right, uv);
}
