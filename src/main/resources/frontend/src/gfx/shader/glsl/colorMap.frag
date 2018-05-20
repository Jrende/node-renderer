precision highp float;
uniform sampler2D gradient;
uniform sampler2D inputTexture;
varying float amount;
varying vec2 uv;

float getAverage(vec3 color) {
  float avg = color.r + color.g + color.b;
  return avg / 3.0;
}

void main(void) {
  vec3 inputColor = texture2D(inputTexture, uv).rgb;
  //gl_FragColor = vec4(inputColor, 1.0);
  //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  gl_FragColor = vec4(texture2D(gradient, vec2(getAverage(inputColor), 0.0)).rgb, 1.0);
}
