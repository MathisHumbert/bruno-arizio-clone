import { find } from 'lodash';

import Background from './Background';
import Title from './Title';

export default class Case {
  constructor({ scene, geometry, screen, viewport, index }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.index = index;

    const project = find(appData.projects, (_, index) => index === this.index);

    this.texture = window.TEXTURES[project.data.desktop.url];
    this.name = project.data.name;

    this.createBackground();
    this.createTitle();
  }

  createBackground() {
    this.background = new Background({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      texture: this.texture,
      index: this.index,
    });
  }

  createTitle() {
    this.title = new Title({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      name: this.name,
      index: this.index,
    });
  }

  /**
   * Animations.
   */
  show(previousTemplate) {
    if (this.background && this.background.show) {
      this.background.show(previousTemplate);
    }

    if (this.title && this.title.show) {
      this.title.show(previousTemplate);
    }
  }

  hide() {
    if (this.background && this.background.hide) {
      this.background.hide();
    }

    if (this.title && this.title.hide) {
      this.title.hide();
    }
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    if (this.background && this.background.onResize) {
      this.background.onResize({ screen, viewport });
    }
  }

  /**
   * Destroy.
   */
  destroy() {}
}
