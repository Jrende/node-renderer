precision highp float;
uniform vec4 to;
uniform vec4 from;
varying float amount;

void main(void) {
  gl_FragColor = mix(from, to, amount);
}
