import ShaderBuilder from './shader/';
import VertexArray from './VertexArray';
import getRenderer from './noderenderers';
import Framebuffer from './Framebuffer';

/*
function measurePerf() {
  let perfEntries = performance.getEntriesByType('measure');
  console.table(perfEntries.map(entry => ({
    name: entry.name,
    duration: entry.duration
  })));
  performance.clearMarks();
  performance.clearMeasures();
}
*/

/*eslint-disable */
function hashCode(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
/ *eslint-enable */

let lastRootNode;

/* global performance */
export default class Renderer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      preserveDrawingBuffer: true
    });
    this.gl.clearColor(0, 0, 0, 1.0);
    let w = this.gl.canvas.width;
    let h = this.gl.canvas.height;
    this.gl.viewport(0, 0, w, h);
    this.output = new Framebuffer(this.gl, 1024, 1024);
    this.quad = new VertexArray(this.gl,
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [1, 0, 2,
        2, 0, 3],
      [3]);
    this.uvLessQuad = new VertexArray(this.gl, [
      1.0, 1.0,
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0
    ], [1, 0, 2, 2, 0, 3], [2]);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.renderCache = [];
    this.renderFunctions = {};
    this.shaders = new ShaderBuilder(this.gl);
    this.shader = this.shaders.getShader('texture');
    window.renderLastFrame = this.renderLastFrame.bind(this);
  }

  renderLastFrame() {
    if(lastRootNode !== undefined) {
      this.render(lastRootNode, true);
    }
  }

  render(rootNode, forceUpdate = false) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    lastRootNode = rootNode;
    if(Object.keys(rootNode.input).length > 0) {
      this.prerender(rootNode, forceUpdate);
      // performance.mark('start render');
      let { finalResult } = this.renderRecursive(rootNode);
      // performance.mark('end render');
      // performance.measure('render', 'start render', 'end render');
      this.present(finalResult);
      // measurePerf();
    }
  }

  prerender(rootNode, forceUpdate) {
    // performance.mark('start createRenderers');
    this.createRenderers(rootNode);
    // performance.mark('end createRenderers');
    // performance.measure('create renderers', 'start createRenderers', 'end createRenderers');
    this.renderCache.forEach(cache => {
      cache.isDirty = false;
    });
    // performance.mark('start calculateDiff');
    if(!forceUpdate) {
      this.calculateDiff(rootNode);
    } else {
      this.renderCache.forEach(cache => {
        cache.isDirty = true;
      });
    }
    // performance.mark('end calculateDiff');
    // performance.measure('calculate diff', 'start calculateDiff', 'end calculateDiff');
  }

  createRenderers(graphNode) {
    Object.keys(graphNode.input).forEach(key => {
      let inputNode = graphNode.input[key];
      this.createRenderers(inputNode);
    });
    let node = graphNode.node;
    if(this.renderCache[graphNode.id] == null) {
      let cache = {
        isDirty: true,
        values: {},
        input: {},
        output: undefined
      };
      if(graphNode.id !== 0) {
        if(this.renderFunctions[graphNode.id] === undefined) {
          let Ctor = getRenderer(node.type);
          let renderer = new Ctor(this.gl, this.shaders);
          this.renderFunctions[graphNode.id] = renderer.render.bind(renderer);
        }
        cache.render = this.renderFunctions[graphNode.id];
      }
      this.renderCache[graphNode.id] = cache;
    }
  }

  calculateDiff(graphNode) {
    let cache = this.renderCache[graphNode.id];
    Object.keys(graphNode.input).forEach(key => {
      let hasChanged = this.calculateDiff(graphNode.input[key]);
      if(hasChanged) {
        cache.isDirty = true;
      }
    });
    let node = graphNode.node;
    let values = Object.keys(node.values);
    for(let i = 0; i < values.length; i++) {
      let key = values[i];
      if(node.values[key] !== cache.values[key]) {
        cache.isDirty = true;
        return true;
      }
    }
    let inputs = Object.keys(graphNode.input);
    for(let i = 0; i < inputs.length; i++) {
      let key = inputs[i];
      if(graphNode.input[key] !== cache.input[key]) {
        cache.isDirty = true;
        return true;
      }
    }
    return this.renderCache[graphNode.id].isDirty;
  }

  renderRecursive(graphNode) {
    let input = {};
    let node = graphNode.node;
    // To render this, I first need to render its children
    Object.keys(graphNode.input).forEach(key => {
      // Each children is connected to an input, named by 'key'
      // This assumes that the renderer will only return a single value.
      // How do we handle multiple return values?
      let output = this.renderRecursive(graphNode.input[key]);
      // AAAh!
      input[key] = output[graphNode.input[key].name];
      // Object.assign(input[key], output[node.input[key].name]);
    });
    if(graphNode.id === 0) {
      return input;
    }
    let cache = this.renderCache[graphNode.id];
    if(cache.isDirty) {
      cache.output = this.renderCache[graphNode.id].render(node.values, input);
      cache.values = node.values;
      cache.input = graphNode.input;
      cache.isDirty = false;
    }
    return cache.output;
  }

  present(texture) {
    this.shader.bind(this.gl);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.shader.setUniforms(this.gl, { sampler: 0, opacity: 1.0 });
    this.uvLessQuad.bind(this.gl);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    this.uvLessQuad.unbind(this.gl);
    this.shader.unbind(this.gl);
  }
}
