precision highp float;
varying vec2 uv;

uniform sampler2D left;
uniform sampler2D right;
uniform sampler2D factor;

float rgbToGrayscale(vec3 color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

void main() {
  vec4 leftColor = texture2D(left, uv);
  vec4 rightColor = texture2D(right, uv);
  float fac = rgbToGrayscale(texture2D(factor, uv).rgb);
  vec4 finalColor = fac * leftColor + (1.0 - fac) * rightColor;
  gl_FragColor = vec4(finalColor.rgb, 1.0);
}
