'use strict';

// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  const INFO =
  {
    LIBRARY: 'p5.primitiva',
    VERSION: '0.0.1',
    HOMEPAGE: 'https://github.com/VisualComputing/p5.primitiva'
  };

  console.log(INFO);

  p5.prototype.primitivaGeometry = function (...args) {
    return this._renderer.primitivaGeometry(...args);
  };

  p5.RendererGL.prototype.primitivaGeometry = function (primitiva, ...args) {
    if (typeof primitiva !== 'function') {
      args = [primitiva, ...args]; // shift solid back into args
      const solids = [
        this.pipe.bind(this),
        this.arrow.bind(this),
        this.mobius.bind(this),
        this.bagel.bind(this)
      ];
      primitiva = p5.prototype.random(solids);
    }
    this.beginGeometry();
    primitiva(...args);
    const model = this.endGeometry();
    // model.clearColors(); // https://p5js.org/reference/p5.Geometry/clearColors/
    model.computeNormals();
    return model;
  };

  p5.prototype.pipe = function (...args) {
    this._renderer.pipe(...args);
  };

  /**
 * Draws a pipe: a cylinder whose faces can be oriented according to given normals.
 * @param  {Number}  detail Cylinder's detail.
 * @param  {Number}  topRadius Cylinder's top radius.
 * @param  {Number}  bottomRadius Cylinder's bottom radius.
 * @param  {Number}  height Cylinder's height.
 * @param  {Vector}  topNormal Top face's normal vector.
 * @param  {Vector}  bottomNormal Bottom face's normal vector.
 */
  p5.RendererGL.prototype.pipe = function ({
    detail = 16,
    topRadius = 10,
    bottomRadius = topRadius,
    height = 50,
    topNormal = new p5.Vector(0, 0, 1),
    bottomNormal = new p5.Vector(0, 0, -1),
    caps = Tree.TOP | Tree.BOTTOM
  } = {}) {
    if (Array.isArray(topNormal)) {
      topNormal = new p5.Vector(topNormal[0] ?? 0, topNormal[1] ?? 0, topNormal[2] ?? 1);
    }
    if (Array.isArray(bottomNormal)) {
      bottomNormal = new p5.Vector(bottomNormal[0] ?? 0, bottomNormal[1] ?? 0, bottomNormal[2] ?? -1);
    }
    this._rendererState = this.push();
    let pm0 = new p5.Vector(0, 0, 0);
    let pn0 = new p5.Vector(0, 0, height);
    let l = new p5.Vector(0, 0, 1);
    const topCap = [];
    const bottomCap = [];
    this.beginShape(0x0005);
    for (let t = 0; t <= detail; t++) {
      const x = Math.cos(t * (2 * Math.PI) / detail);
      const y = Math.sin(t * (2 * Math.PI) / detail);
      const l0 = new p5.Vector(x, y, 0).mult(topRadius);
      const l1 = new p5.Vector(x, y, 0).mult(bottomRadius);
      const u = float(t) / detail;
      const d0 = (topNormal.dot(p5.Vector.sub(pm0, l0))) / (l.dot(topNormal));
      const p0 = p5.Vector.add(p5.Vector.mult(l, d0), l0);
      topCap.push(p0);
      this.vertex(p0.x, p0.y, p0.z, u, 0);
      l0.set(l0.x, l0.y, height);
      const d1 = (bottomNormal.dot(p5.Vector.sub(pn0, l1))) / (l.dot(bottomNormal));
      const p1 = p5.Vector.add(p5.Vector.mult(l, d1), l1);
      bottomCap.push(p1);
      this.vertex(p1.x, p1.y, p1.z, u, 1);
    }
    this.endShape();
    if ((~(caps | ~Tree.TOP) === 0)) {
      this.beginShape(0x0005);
      for (const cap of topCap) {
        this.vertex(0, 0, 0, 0.5, 0.5)
        this.vertex(cap.x, cap.y, cap.z, (cap.x + topRadius) / (2 * topRadius), (cap.y + topRadius) / (2 * topRadius));
      }
      this.endShape();
    }
    if ((~(caps | ~Tree.BOTTOM) === 0)) {
      this.beginShape(0x0005);
      for (const cap of bottomCap) {
        this.vertex(0, 0, height, 0.5, 0.5)
        this.vertex(cap.x, cap.y, cap.z, (cap.x + bottomRadius) / (2 * bottomRadius), (cap.y + bottomRadius) / (2 * bottomRadius));
      }
      this.endShape();
    }
    this.pop(this._rendererState);
  };

  p5.prototype.arrow = function (...args) {
    this._renderer.arrow(...args);
  };

  /**
 * Draws a simple arrow
 * @param  {Number}  detail Arrow's detail.
 * @param  {Number}  radius Arrow's radius.
 * @param  {Number}  height Arrow's height.
 */
  p5.RendererGL.prototype.arrow = function ({ detail = 16, radius = 10, height = 50 } = {}) {
    const headHeight = height * 0.3;
    const headRadius = radius * 1.6;
    const bodyHeight = height * 0.7;
    this._rendererState = this.push();
    // arrow's head
    this.pipe({ detail, topRadius: 0, bottomRadius: headRadius, height: headHeight, caps: Tree.BOTTOM });
    this.translate(0, 0, headHeight);
    // arrow's body
    this.pipe({ detail, topRadius: radius, height: bodyHeight, caps: Tree.BOTTOM });
    this.pop(this._rendererState);
  };

  p5.prototype.mobius = function (...args) {
    this._renderer.mobius(...args);
  };

  /**
 * Draws a mobius strip.
 * @param  {Number}  detail mobius strip's detail.
 * @param  {Number}  radius mobius strip's radius.
 */
  p5.RendererGL.prototype.mobius = function ({ detail = 16, radius = 50 } = {}) {
    this._rendererState = this.push();
    const uFragment = (2 * Math.PI) / detail;
    this.beginShape(0x0005);
    for (let u = 0; u <= (2 * Math.PI); u += uFragment) {
      const x0 = (1 + (-1 / 2) * Math.cos(u / 2)) * Math.cos(u);
      const y0 = (1 + (-1 / 2) * Math.cos(u / 2)) * Math.sin(u);
      const z0 = (-1 / 2) * Math.sin(u / 2);
      const x1 = (1 + (1 / 2) * Math.cos(u / 2)) * Math.cos(u);
      const y1 = (1 + (1 / 2) * Math.cos(u / 2)) * Math.sin(u);
      const z1 = (1 / 2) * Math.sin(u / 2);
      this.vertex(x0 * radius, y0 * radius, z0 * radius, u / (2 * Math.PI), 0);
      this.vertex(x1 * radius, y1 * radius, z1 * radius, u / (2 * Math.PI), 1);
    }
    this.vertex(1.5 * radius, 0, 0, 1, 0);
    this.vertex(0.5 * radius, 0, 0, 1, 1);
    this.endShape();
    this.pop(this._rendererState);
  };

  p5.prototype.bagel = function (...args) {
    this._renderer.bagel(...args);
  };

  /**
 * Draws an immersion of the Klein bottle known as a "bagel".
 * @param {Number} mayorDetail detail of the bagel's mayor radius.
 * @param {Number} minorDetail detail of the bagel's minor radius.
 * @param {Number} mayorRadius bagel's mayor radius.
 * @param {Number} minorDetail bagel's minor radius.
 */
  p5.RendererGL.prototype.bagel = function ({ mayorDetail = 32, minorDetail = 32, mayorRadius = 30, minorRadius = 20 } = {}) {
    this._rendererState = this.push();
    const theta_detail = (2 * Math.PI) / mayorDetail;
    const phi_detail = (2 * Math.PI) / minorDetail;
    this.beginShape(0x0005);
    const lastCircle = [];
    for (let i = 0; i <= mayorDetail; i++) {
      const theta = i * theta_detail;
      for (let j = 0; j <= minorDetail; j++) {
        // for more info on this function: https://en.wikipedia.org/wiki/Klein_bottle#Parametrization
        const phi = j * phi_detail;
        const commonFactor = mayorRadius + minorRadius * (Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi));
        const x = commonFactor * Math.cos(theta);
        const y = commonFactor * Math.sin(theta);
        const z = minorRadius * (Math.sin(theta / 2) * Math.sin(phi) + Math.cos(theta / 2) * Math.sin(2 * phi));
        const u = j / minorDetail;
        const v = i / mayorDetail;
        const currentPoint = { ...new p5.Vector(x, y, z), u, v };
        const lastPoint = lastCircle[j];
        if (lastPoint) {
          this.vertex(lastPoint.x, lastPoint.y, lastPoint.z, lastPoint.u, lastPoint.v);
          this.vertex(currentPoint.x, currentPoint.y, currentPoint.z, currentPoint.u, currentPoint.v);
        }
        lastCircle[j] = currentPoint;
      }
    }
    this.endShape();
    this.pop(this._rendererState);
  };
})();