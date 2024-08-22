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

  p5.RendererGL.prototype.pipe = function (...args) {
    // TODO implement me
  };

  p5.prototype.arrow = function (...args) {
    this._renderer.arrow(...args);
  };

  p5.RendererGL.prototype.arrow = function (...args) {
    // TODO implement me
  };

  p5.prototype.mobius = function (...args) {
    this._renderer.mobius(...args);
  };

  p5.RendererGL.prototype.mobius = function (...args) {
    // TODO implement me
  };

  p5.prototype.bagel = function (...args) {
    this._renderer.bagel(...args);
  };

  p5.RendererGL.prototype.bagel = function (...args) {
    // TODO implement me
  };
})();