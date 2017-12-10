/* global gl */

function initTexture(gl, width, height, format, attachment) {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);

  return texture;
}

function initRenderBuffer(gl, width, height, component, attachment) {
  const renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, component, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBuffer);
  return renderBuffer;
}

//gl.DEPTH_COMPONENT16
//gl.DEPTH_ATTACHMENT
export default class Framebuffer {
  constructor(gl, width, height, withStencil = false, withDepth = false) {
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    this.texture = initTexture(gl, width, height, gl.RGBA, gl.COLOR_ATTACHMENT0);

    if(withDepth) {
      this.depth = initRenderBuffer(
        gl,
        width,
        height,
        gl.DEPTH_COMPONENT16,
        gl.DEPTH_ATTACHMENT);
    }

    if(withStencil) {
      this.stencilBuffer = initRenderBuffer(
        gl,
        width,
        height,
        gl.STENCIL_INDEX8,
        gl.STENCIL_ATTACHMENT);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffer = framebuffer;
    this.width = width;
    this.height = height;
  }

  bind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  unbind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  renderTo(gl, renderCmd) {
    this.bind(gl);
    renderCmd();
    this.unbind(gl);
    return this;
  }
}

export class Doublebuffer {
  constructor(gl, width, height, withStencil = false, withDepth = false) {
    this.front = new Framebuffer(width, height, withStencil, withDepth);
    this.back = new Framebuffer(width, height, withStencil, withDepth);
  }


  bind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.front.framebuffer);
  }

  unbind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.flip();
  }

  flip() {
    let temp = this.front;
    this.front = this.back;
    this.back = temp;
  }

  getTexture() {
    return this.back.texture;
  }

  renderTo(gl, renderCmd) {
    this.bind(gl);
    renderCmd();
    this.unbind(gl);
    return this;
  }
}
