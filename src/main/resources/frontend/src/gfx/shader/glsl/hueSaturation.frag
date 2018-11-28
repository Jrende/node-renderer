precision highp float;
uniform sampler2D hue;
uniform sampler2D saturation;
uniform sampler2D lightness;
uniform sampler2D inputTexture;
varying vec2 uv;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float getAverage(vec3 color) {
  float avg = color.r + color.g + color.b;
  return avg / 3.0;
}

void main(void) {
  vec3 color = texture2D(inputTexture, uv).rgb;
  vec3 hsv = rgb2hsv(color);
  float hueVal = getAverage(texture2D(hue, uv).rgb);
  float saturationVal = getAverage(texture2D(saturation, uv).rgb);
  float lightnessVal = getAverage(texture2D(lightness, uv).rgb);
  hsv.x = hsv.x + hueVal;
  hsv.y = hsv.y + saturationVal;
  hsv.z = hsv.z + lightnessVal;
  vec3 rgb = hsv2rgb(hsv);
  gl_FragColor = vec4(rgb, 1.0);
}
