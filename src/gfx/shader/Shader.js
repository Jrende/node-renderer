/* globals gl */

let dataTypes = ['float', 'vec2', 'vec3', 'vec4', 'mat3', 'mat4', 'sampler2D'];
function compileShader(gl, src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Error when compiling shader: ${gl.getShaderInfoLog(shader)}`);
    console.groupCollapsed('Shader source');
    console.log(src);
    console.groupEnd();
    return null;
  }
  return shader;
}
function createShaderProgram(gl, vertexShader, fragmentShader) {
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    let info = gl.getProgramInfoLog(shaderProgram);
    console.error(`Error compiling shader: \n\n${info}`);
  }
  gl.useProgram(shaderProgram);
  const loc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(loc);
  return shaderProgram;
}

function setUniform(gl, uniformHandle, type, value) {
  switch (type) {
    case 'float': return gl.uniform1f(uniformHandle, value);
    case 'vec2': return gl.uniform2fv(uniformHandle, value);
    case 'vec3': return gl.uniform3fv(uniformHandle, value);
    case 'vec4': return gl.uniform4fv(uniformHandle, value);
    case 'mat3': return gl.uniformMatrix3fv(uniformHandle, false, value);
    case 'mat4': return gl.uniformMatrix4fv(uniformHandle, false, value);
    case 'sampler2D': return gl.uniform1i(uniformHandle, value);
    default: {
      console.error('Unable to create uniform setter for type', type);
      return undefined;
    }
  }
}

function handleStruct(tokens) {
  console.log('handleStruct');
  let uniforms = [];
  let name = '';
  for(let i = 0; i < tokens.length; i++) {
    if(dataTypes.includes(tokens[i])) {
      uniforms.push({
        name: tokens[i + 1],
        type: tokens[i]
      });
    } else if(tokens[i] === '}') {
      name = tokens[i + 1];
      break;
    }
  }
  return { name, uniforms };
}

function getUniforms(sources) {
  let regex = /( |\n|;)/;
  let uniforms = {};
  for(let i = 0; i < sources.length; i++) {
    let tokens = sources[i].split(regex).filter(t => t !== undefined &&
      t.length !== 0 &&
      t !== ' ' &&
      t !== ';');
    for(let j = 0; j < tokens.length; j++) {
      if(tokens[j] === 'uniform') {
        if(tokens[j + 1] === 'struct') {
          let struct = handleStruct(tokens.slice(j + 1));
          struct.uniforms.forEach(uniform => {
            uniforms[`${struct.name}.${uniform.name}`] = {
              type: uniform.type
            };
          });
        } else {
          uniforms[tokens[j + 2]] = {
            type: tokens[j + 1]
          };
        }
      }
    }
  }
  return uniforms;
}

function createUniformHandles(gl, shader) {
  Object.entries(shader.uniforms).forEach(uniform => {
    uniform[1].handle = gl.getUniformLocation(shader.program, uniform[0]);
  });
}

function isValue(value) {
  return !(value instanceof Object) ||
    (value instanceof Array) ||
    (value instanceof Float32Array) ||
    (value instanceof Float64Array) ||
    (value instanceof Int32Array) ||
    (value instanceof Int8Array) ||
    (value instanceof Int16Array);
}

function getUniformValues(uniforms, ret = [], name = '') {
  let keys = Object.keys(uniforms);
  for(let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = uniforms[key];
    if(isValue(value)) {
      ret.push({
        name: name + key,
        value
      });
    } else {
      getUniformValues(value, ret, `${key}.${name}`);
    }
  }

  return ret;
}

export default class Shader {
  constructor(src) {
    this.vert = src.vert;
    this.frag = src.frag;
  }

  bind(gl) {
    if(!this.compiled) {
      throw new Exception("Can't bind uncompiled shader");
    }
    gl.useProgram(this.program);
  }

  compile(gl) {
    if (!this.compiled) {
      this.uniforms = getUniforms([this.vert, this.frag]);
      const vertProgram = compileShader(gl, this.vert, gl.VERTEX_SHADER);
      const fragProgram = compileShader(gl, this.frag, gl.FRAGMENT_SHADER);
      this.program = createShaderProgram(gl, vertProgram, fragProgram);
      createUniformHandles(gl, this);
      this.compiled = true;
    }
  }

  setUniforms(gl, uniforms) {
    let values = getUniformValues(uniforms);
    values.forEach(value => {
      let uniform = this.uniforms[value.name];
      if(!uniform) {
        console.error(`Unable to find uniform ${value.name}!`);
        return;
      }
      //TODO: add validation, compare value type to uniform type etc.
      if(uniform.handle != null) {
        setUniform(gl, uniform.handle, uniform.type, value.value);
      }
    });
  }

  unbind(gl) {
    gl.useProgram(null);
  }
}

