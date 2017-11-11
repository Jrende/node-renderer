attribute vec3 aVertexPosition;
varying vec3 worldPos;
uniform mat4 mvp;
uniform mat4 modelMat;
uniform float aspectRatio;
void main(void) {
  worldPos = (modelMat * vec4(aVertexPosition, 1.0)).xyz;
  vec4 pos = mvp * vec4(aVertexPosition, 1.0);
  pos.x /= aspectRatio;

    //vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
  gl_Position = pos;
}
