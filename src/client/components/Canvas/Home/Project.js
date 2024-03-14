import * as THREE from 'three';

import Background from './Background';
import Title from './Title';

export default class Project {
  constructor({ scene, geometry, screen, viewport, texture, name, index }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.texture = texture;
    this.name = name;
    this.index = index;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.location = this.viewport.height * 1.33 * this.index * -1;

    this.createBackground();
    this.createTitle();
  }

  createBackground() {
    this.background = new Background({
      scene: this.group,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      texture: this.texture,
      index: this.index,
    });
  }

  createTitle() {
    this.title = new Title({
      scene: this.group,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      texture: this.texture,
      name: this.name,
      index: this.index,
    });
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.location = this.viewport.height * 1.33 * this.index * -1;

    if (this.background && this.background.onResize) {
      this.background.onResize({ screen, viewport });
    }
  }

  onTouchStart() {
    if (this.background && this.background.onTouchStart) {
      this.background.onTouchStart();
    }
  }

  onTouchEnd() {
    if (this.background && this.background.onTouchEnd) {
      this.background.onTouchEnd();
    }
  }

  /**
   * Animations.
   */
  show() {
    if (this.background && this.background.show) {
      this.background.show();
    }
  }

  hide() {
    if (this.background && this.background.hide) {
      this.background.hide();
    }
  }

  /**
   * Loop.
   */
  update(scroll, time) {
    const percent = this.group.position.y / this.viewport.height;

    this.group.position.y = this.location + scroll;

    if (this.background && this.background.update) {
      this.background.update(percent, time);
    }
  }

  /**
   * Destroy.
   */
  destroy() {
    // destroy group
  }
}
