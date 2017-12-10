import * as glm from 'gl-matrix';
import Transform from './Transform';
import SolidMaterial from './material/SolidMaterial';

export default class World {
  constructor(geometry, renderList = { opaque: [], transparent: [] }) {
    this.transformValue = new Transform();
    this.effectiveTransform = new Transform();
    this.geometry = geometry;
    this.children = [];
    this.parent = null;
    this.camera = null;
    this.renderList = renderList;
  }

  createChild(geometry, material = new SolidMaterial([1.0, 1.0, 1.0])) {
    let newWorld = new World(undefined, this.renderList);
    newWorld.parent = this;
    newWorld.camera = this.camera;
    if(geometry !== undefined) {
      geometry.addToWorld(newWorld, material);
      //Won't work with moving camera, would need to update every frame
      let newDrawObjs = newWorld.getChildren();
      newDrawObjs.opaque.forEach(node => this.renderList.opaque.push(node));
      newDrawObjs.transparent.forEach(node => this.renderList.transparent.push(node));
    }
    this.children.push(newWorld);
    newWorld.update();
    return newWorld;
  }

  //Maybe autocreate these functions?
  getPosition() {
    return this.effectiveTransform.pos;
  }

  identity() {
    this.transformValue.identity();
    this.update();
    return this;
  }

  translate(vec3) {
    this.transformValue.translate(vec3);
    this.update();
    return this;
  }

  scale(vec3) {
    this.transformValue.scale(vec3);
    this.update();
    return this;
  }

  rotate(angle, axis) {
    this.transformValue.rotate(angle, axis);
    this.update();
    return this;
  }

  transform(mat) {
    this.transformValue.transform(mat);
    this.update();
    return this;
  }

  update() {
    let parentTransform = null;
    if(this.parent == null) {
      parentTransform = {
        mat: glm.mat4.create()
      };
    } else {
      parentTransform = this.parent.effectiveTransform;
    }

    glm.mat4.mul(this.effectiveTransform.mat, parentTransform.mat, this.transformValue.mat);
    this.children.forEach(child => child.update(this.effectiveTransform));
  }

  getChildren(opaque = [], transparent = []) {
    this.children.forEach((node) => {
      node.getChildren(opaque, transparent);
      if(node.geometry != null) {
        let obj = {
          vertexArray: node.geometry,
          material: node.material,
          transform: node.effectiveTransform
        };
        if(node.material.isTransparent()) {
          transparent.push(obj);
        } else {
          opaque.push(obj);
        }
      }
    });
    return { opaque, transparent };
  }
}
