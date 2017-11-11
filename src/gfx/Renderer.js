import shaders from './shader/';
import VertexArray from './VertexArray';
import getRenderer from './noderenderers';
import Framebuffer from './Framebuffer.js';

export default class Renderer {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl");
    this.gl.clearColor(0, 0, 0, 1.0);
    this.solidShader = shaders.solid;
    this.solidShader.compile(this.gl);
    this.shader = shaders.texture;
    this.shader.compile(this.gl);
    shaders.cloud.compile(this.gl);
    shaders.solid.compile(this.gl);
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

  }

  render(rootNode) {
    /*
    this.renderCache = {};
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    let {finalResult} = this.renderRecursive(rootNode);
    console.log("Plix render rootNode");
    */
    let canvas = this.gl.canvas;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.output.renderTo(this.gl, () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      shaders.cloud.bind(this.gl);
      this.quad.bind(this.gl);
      shaders.cloud.setUniforms(this.gl, {
        res: [canvas.clientWidth, canvas.clientHeight],
        seed: 1231,
        size: 1000,
        density: 1,
        left: 1,
        color: [1.0, 1.0, 1.0]
      });
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
      this.quad.unbind(this.gl);
      shaders.cloud.unbind(this.gl);
    });
    this.present(this.output.texture);
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
    console.log(`Render ${node.type.name}-${node.id}`);
    let renderer = new (getRenderer(node.type))(this.gl);
    let values = renderer.render(input);
    //shader.compile(this.gl);
    return values;
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
