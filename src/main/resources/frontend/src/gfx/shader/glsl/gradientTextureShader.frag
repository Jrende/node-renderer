precision highp float;

uniform sampler2D sampler;
uniform float opacity;
varying vec2 uv;
uniform mat4 uvMvp;

void main(void) {
  gl_FragColor = vec4(texture2D(sampler, uv).rgb * opacity, opacity);
}
