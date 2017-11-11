import shaders from './shader';
import VertexArray from './VertexArray';

export function nextPowOf2(x) {
  return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
}

export function length(vec) {
  switch (vec.length) {
    case 2:
      return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    case 3:
      return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    default: {
      return Math.sqrt(vec.reduce((a, b) => a * a + b * b));
    }
  }
}

export function normalize(vec) {
  const len = length(vec);
  switch (vec.length) {
    case 2:
      return [
        vec[0] / len,
        vec[1] / len
      ];
    case 3:
      return [
        vec[0] / len,
        vec[1] / len,
        vec[2] / len
      ];
    default: {
      const ret = [];
      for(let i = 0; i < vec.length; i++) {
        ret[i] /= len;
      }
      return ret;
    }
  }
}

const quad;
/* global gl */
export function drawTexture(gl, texture, opacity=1.0) {
  if(quad == null) {
    quad = new VertexArray([
      1.0, 1.0,
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0
    ], [0, 1, 2, 0, 2, 3], [2]);
  }

  let shader = shaders.texture;
  quad.initialize(gl);
  gl.clear(gl.COLOR_BUFFER_BIT);
  shader.bind(gl);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  shader.uniforms.sampler = 0;
  shader.uniforms.opacity = opacity;
  quad.bind(gl);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  quad.unbind(gl);
  shader.unbind(gl);
}


export function degToRad(deg) {
  return deg * Math.PI / 180;
}


export function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

export function colorToArray(col) {
  let c = col.toRgb();
  return [c.r, c.g, c.b].map(i => i / 255.0);
}

