/* globals gl */
export default class VertexArray {
  constructor(gl, vertexData, indexData, attrs, drawMode = gl.TRIANGLES) {
    if (vertexData instanceof Float32Array) {
      this.vertexData = vertexData;
    } else {
      this.vertexData = new Float32Array(vertexData);
    }

    if (indexData instanceof Uint16Array) {
      this.indexData = indexData;
    } else {
      this.indexData = new Uint16Array(indexData);
    }

    this.drawMode = drawMode;
    this.attrs = attrs;
    this.initialize(gl);
  }

  initialize(gl) {
    this.vertBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    if (this.indexData !== undefined) {
      this.indexBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
    }
    this.isInitialized = true;
  }

  bind(gl) {
    if (this.isInitialized !== true) {
      console.error('Tried to use uninitialized VertexArray!');
      return;
    }
    const attrSum = this.attrs.reduce((a, b) => a + b);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    if (this.indexData !== undefined) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    }
    let pointer = 0;
    for (let i = 0; i < this.attrs.length; i++) {
      gl.vertexAttribPointer(i, this.attrs[i], gl.FLOAT, false, attrSum * 4, pointer * 4);
      gl.enableVertexAttribArray(i);
      pointer += this.attrs[i];
    }
  }

  draw(gl) {
    gl.drawElements(this.drawMode, this.indexData.length, gl.UNSIGNED_SHORT, 0);
  }

  unbind(gl) {
    for (let i = 0; i < this.attrs.length; i++) {
      gl.disableVertexAttribArray(i);
    }
    if (this.indexData !== undefined) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  free(gl) {
    gl.deleteBuffer(this.vertBuf);
    if(this.indexBuf) {
      gl.deleteBuffer(this.indexBuf);
    }
  }
}
