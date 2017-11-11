precision highp float;

uniform sampler2D sampler;
varying vec2 uv;

bool floatEquals(float actual, float expected, float margin) {
  return actual > (expected - margin) && actual < (expected + margin);
}

void main(void) {
  vec3 color = texture2D(sampler, uv).rgb;
  /*
  float margin = 0.5;
  if(floatEquals(color.x, 0.0, margin) &&  floatEquals(color.y, 0.0, margin) &&  floatEquals(color.z, 0.0, margin)) {
    color = vec3(1.0, 1.0, 1.0);
  }
  */
  color = vec3(1.0, 1.0, 1.0) - color;
  float temp = color.g;
  color.g = color.b;
  color.b = temp;
  gl_FragColor = vec4(color, 1.0);
}
