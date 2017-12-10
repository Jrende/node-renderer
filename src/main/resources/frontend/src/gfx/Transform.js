import * as glm from 'gl-matrix';
import { degToRad } from './Utils';

function calculateModelMatrix(transform) {
  glm.mat4.identity(transform.mat);

  glm.mat4.translate(transform.mat, transform.mat, transform.pos);

  let rotMat = glm.mat4.fromQuat(glm.mat4.create(), transform.rot);
  glm.mat4.mul(transform.mat, transform.mat, rotMat);

  glm.mat4.scale(transform.mat, transform.mat, transform.scaleValue);
}

export default class Transform {
  constructor() {
    this.mat = glm.mat4.create();
    this.pos = [0, 0, 0];
    this.scaleValue = [1, 1, 1];
    this.rot = glm.quat.create();
  }

  identity() {
    this.mat = glm.mat4.create();
  }

  setPosition(pos) {
    this.pos = pos;
    if(this.pos[2] === undefined) {
      this.pos[2] = 0;
    }
    calculateModelMatrix(this);
  }

  getPosition() {
    return [
      this.mat[12],
      this.mat[13],
      this.mat[14]
    ];
  }

  //How does this interact with changing matrices from World?
  translate(vec3) {
    this.pos[0] += vec3[0];
    this.pos[1] += vec3[1];
    if(vec3[2] !== undefined) {
      this.pos[2] += vec3[2];
    }
    calculateModelMatrix(this);
  }

  setScale(scale) {
    this.scaleValue = scale;
    if(this.scaleValue[2] === undefined) {
      this.scaleValue[2] = 1;
    }
    calculateModelMatrix(this);
  }

  scale(vec3) {
    this.scaleValue[0] *= vec3[0];
    this.scaleValue[1] *= vec3[1];
    if(vec3[2] !== undefined) {
      this.scaleValue[2] *= vec3[2];
    }
    calculateModelMatrix(this);
  }

  rotate(angle, axis) {
    let newRot = glm.quat.create();
    glm.quat.setAxisAngle(newRot, axis, degToRad(angle));
    glm.quat.multiply(this.rot, this.rot, newRot);
    calculateModelMatrix(this);
  }

  setRotationQuat(quat) {
    this.rot = quat;
    calculateModelMatrix(this);
  }

  transform(mat) {
    //glm.mat4.mul(this.mat, this.mat, mat);
    glm.mat4.mul(this.mat, mat, this.mat);
  }

  getMatrix() {
    return this.mat;
  }
}
