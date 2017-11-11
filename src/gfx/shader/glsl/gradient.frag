precision highp float;
uniform vec2 resolution;
uniform float size;

float dist(vec2 p1, vec2 p2) {
  return sqrt((p1.x - p2.x)*(p1.x - p2.x)+(p1.y - p2.y)*(p1.y - p2.y));
}

void main( void ) {
  vec2 p = gl_FragCoord.xy;
  vec2 c = resolution.xy / 2.0;

  float d = sqrt((p.x - c.x)*(p.x - c.x)+(p.y - c.y)*(p.y - c.y));
  vec3 color = mix(vec3(1,1,1), vec3(0,0,0), (d/(resolution.x * size)));
  //color *= cos(p.y);

  gl_FragColor = vec4(vec3(color), 1.0);
}
