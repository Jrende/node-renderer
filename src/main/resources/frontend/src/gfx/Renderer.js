import ShaderBuilder from './shader/';
import VertexArray from './VertexArray';
import getRenderer from './noderenderers';
import Framebuffer from './Framebuffer';

function createGraph(nodes, connections, id = 0) {
  let graph = {
    node: nodes[id],
    input: {},
    id
  };
  connections
    .filter(c => c.to.id === id)
    .forEach(c => {
      // TODO: Fix for multiple outputs
      graph.input[c.to.name] = createGraph(nodes, connections, c.from.id);
      graph.input[c.to.name].name = c.from.name;
    });
  return graph;
}

let lastNodes;
let lastConnections;

export default class Renderer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      preserveDrawingBuffer: true
    });
    this.gl.clearColor(0, 0, 0, 1.0);
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
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.size = {
      width: this.gl.canvas.width,
      height: this.gl.canvas.height
    };
    this.gl.viewport(0, 0, this.size.width, this.size.height);
    this.output = new Framebuffer(this.gl, this.size.width, this.size.height);
    Object.keys(this.renderFunctions).forEach(key => {
      this.renderFunctions[key].setSize(this.size);
    });
  }

  renderLastFrame() {
    if(lastNodes !== undefined && lastConnections !== undefined) {
      this.render(lastNodes, lastConnections, true);
    }
  }

  render(nodes, connections, forceUpdate = false) {
    lastNodes = nodes;
    lastConnections = connections;
    let rootNode = createGraph(nodes, connections);
    this.prerender(rootNode, forceUpdate);
    let { out } = this.renderRecursive(rootNode);
    this.present(out);
  }

  prerender(rootNode, forceUpdate) {
    this.createRenderers(rootNode);
    this.renderCache.forEach(cache => {
      cache.isDirty = false;
    });
    if(forceUpdate) {
      this.renderCache.forEach(cache => {
        cache.isDirty = true;
      });
    } else {
      this.calculateDiff(rootNode);
    }
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
      if(this.renderFunctions[graphNode.id] === undefined) {
        let Ctor = getRenderer(node.type);
        let renderer = new Ctor(this.gl, this.shaders);
        renderer.setSize(this.size);
        this.renderFunctions[graphNode.id] = renderer.render.bind(renderer);
        this.renderFunctions[graphNode.id].setSize = renderer.setSize.bind(renderer);
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
    if(inputs.length !== Object.keys(cache.input).length) {
      cache.isDirty = true;
      return true;
    }
    for(let i = 0; i < inputs.length; i++) {
      let key = inputs[i];
      if(graphNode.input[key].id !== cache.input[key].id) {
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
    let cache = this.renderCache[graphNode.id];
    if(cache.isDirty) {
      console.log('Rerender node ', graphNode.id);
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
