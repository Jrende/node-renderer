precision highp float;

uniform sampler2D sampler;
uniform sampler2D opacity;
varying vec2 uv;

float rgbToGrayscale(vec3 color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

void main(void) {
  vec4 color = texture2D(sampler, uv);
  float fac = rgbToGrayscale(texture2D(opacity, uv).rgb);
  gl_FragColor = vec4(color.rgb * fac, fac);
}
