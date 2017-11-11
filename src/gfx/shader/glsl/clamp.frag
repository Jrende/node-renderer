precision highp float;
varying vec2 vTexCoord;

uniform sampler2D texture;
uniform float limit;

void main(void) {
  vec3 col = texture2D(texture, vTexCoord).rgb;
  float val = (col.x + col.y + col.z) / 3.0;
  if(val > limit) {
    col = vec3(1, 1, 1);
  } else {
    col = vec3(0, 0, 0);
  }

  gl_FragColor = vec4(col, 1.0);
}
