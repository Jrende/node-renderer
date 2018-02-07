precision highp float;
uniform vec2 resolution;

#define PI2 6.28318530718

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float getAngle(vec2 v1, vec2 v2) {
  float det = v1.x*v2.y - v1.y * v2.x;
  float rad = atan(dot(v1, v2), det);
  if(rad < 0.0) {
   rad += PI2;
  }
  return rad;
}

void main(void) {
  vec2 pos = gl_FragCoord.xy / resolution.xy;
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(pos, center);
  if(dist > 0.3 && dist < 0.5) {
    vec2 dir = normalize(pos - center);
    float hue = getAngle(dir, vec2(0.0, 1.0)) / PI2;
    vec3 hsv = hsv2rgb(vec3(hue, 1.0, 1.0));
    color = vec4(hsv, 1.0);
  }
  gl_FragColor = color;
}
