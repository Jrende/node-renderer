import ShaderBuilder from './shader/';
import VertexArray from './VertexArray';
import getRenderer from './noderenderers';
import Framebuffer from './Framebuffer';

function measurePerf() {
  let perfEntries = performance.getEntriesByType('measure');
  console.table(perfEntries.map(entry => ({
    name: entry.name,
    duration: entry.duration
  })));
  performance.clearMarks();
  performance.clearMeasures();
}

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
    this.output = new Framebuffer(this.gl, 1024, 1024, false, false);
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
  }

  render(rootNode) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    if(Object.keys(rootNode.input).length > 0) {
      this.prerender(rootNode);
      performance.mark('start render');
      let { finalResult } = this.renderRecursive(rootNode);
      performance.mark('end render');
      performance.measure('render', 'start render', 'end render');
      this.present(finalResult);
      //measurePerf();
    }
  }

  prerender(rootNode) {
    performance.mark('start createRenderers');
    this.createRenderers(rootNode);
    performance.mark('end createRenderers');
    performance.measure('create renderers', 'start createRenderers', 'end createRenderers');
    this.renderCache.forEach(cache => {
      cache.isDirty = false;
    });
    performance.mark('start calculateDiff');
    this.calculateDiff(rootNode);
    performance.mark('end calculateDiff');
    performance.measure('calculate diff', 'start calculateDiff', 'end calculateDiff');
  }

  createRenderers(node) {
    Object.keys(node.input).forEach(key => {
      this.createRenderers(node.input[key].node);
    });
    if(this.renderCache[node.id] == null) {
      let cache = {
        isDirty: true,
        values: {},
        input: {},
        output: undefined
      };
      if(node.id !== 0) {
        if(this.renderFunctions[node.type.id] === undefined) {
          let Ctor = getRenderer(node.type);
          let renderer = new Ctor(this.gl, this.shaders);
          this.renderFunctions[node.type.id] = renderer.render.bind(renderer);
        }
        cache.render = this.renderFunctions[node.type.id];
      }
      this.renderCache[node.id] = cache;
    }
  }

  calculateDiff(node) {
    let cache = this.renderCache[node.id];
    Object.keys(node.input).forEach(key => {
      let hasChanged = this.calculateDiff(node.input[key].node);
      if(hasChanged) {
        cache.isDirty = true;
      }
    });
    let values = Object.keys(node.values);
    for(let i = 0; i < values.length; i++) {
      let key = values[i];
      if(node.values[key] !== cache.values[key]) {
        cache.isDirty = true;
        return true;
      }
    }
    let inputs = Object.keys(node.input);
    for(let i = 0; i < inputs.length; i++) {
      let key = inputs[i];
      if(node.input[key] !== cache.input[key]) {
        cache.isDirty = true;
        return true;
      }
    }
    return this.renderCache[node.id].isDirty;
  }

  renderRecursive(node) {
    let input = {};
    //To render this, I first need to render its children
    Object.keys(node.input).forEach(key => {
      input[key] = {};
      //Each children is connected to an input, named by 'key'
      //This assumes that the renderer will only return a single value.
      //How do we handle multiple return values?
      let output = this.renderRecursive(node.input[key].node);
      //AAAh!
      input[key] = output[node.input[key].name];
      //Object.assign(input[key], output[node.input[key].name]);
    });
    if(node.id === 0) {
      return input;
    }
    let cache = this.renderCache[node.id];
    if(cache.isDirty) {
      cache.output = this.renderCache[node.id].render(node.values, input);
      cache.values = node.values;
      cache.input = node.input;
      cache.isDirty = false;
    }
    //shader.compile(this.gl);
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
