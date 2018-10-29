precision highp float;
varying vec2 uv;

uniform sampler2D leftTexture;
uniform vec4 leftValue;
uniform bool leftConnection;
uniform sampler2D rightTexture;
uniform vec4 rightValue;
uniform bool rightConnection;
uniform float factor;

vec4 getRightValue() {
  if(rightConnection) {
    return texture2D(rightTexture, uv);
  } else {
    return rightValue;
  }
}

vec4 getLeftValue() {
  if(leftConnection) {
    return texture2D(leftTexture, uv);
  } else {
    return leftValue;
  }
}

void main() {
  vec4 leftColor = getLeftValue();
  vec4 rightColor = getRightValue();
  vec4 finalColor = factor * leftColor + (1.0 - factor) * rightColor;
  gl_FragColor = finalColor;
}
