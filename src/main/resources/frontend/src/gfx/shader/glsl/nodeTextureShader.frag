precision highp float;

uniform bool connection;
uniform vec4 value;
uniform sampler2D sampler;

uniform float opacity;
varying vec2 uv;

vec4 getValue() {
  if(connection) {
    return texture2D(sampler, uv);
  } else {
    return value;
  }
}

void main(void) {
  vec4 color = getValue();
  gl_FragColor = vec4(color.rgb * opacity, opacity);
}
