precision highp float;
uniform sampler2D inputTexture;
uniform sampler2D gradient;
varying float amount;
varying vec2 uv;

float rgbToGrayscale(vec3 color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

float getAverage(vec3 color) {
  float avg = color.r + color.g + color.b;
  return avg / 3.0;
}

void main(void) {
  vec3 inputColor = texture2D(inputTexture, uv).rgb;
  float avg = rgbToGrayscale(inputColor);
  gl_FragColor = vec4(texture2D(gradient, vec2(avg, 0.0)).rgb, 1.0);
}
