import { each, map } from 'lodash';
import * as THREE from 'three';

import Title from './Title';

export default class Titles {
  constructor({ scene, screen, viewport }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.height = 0;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createTitles();
  }

  createTitles() {
    this.titles = map(
      appData.projects,
      (project, index) =>
        new Title({
          scene: this.group,
          screen: this.screen,
          viewport: this.viewport,
          name: project.data.name,
          index,
        })
    );

    this.height = this.titles[0].height + this.titles[0].padding;
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    each(this.titles, (title) => {
      if (title && title.onResize) {
        title.onResize({ screen, viewport });
      }
    });

    this.height = this.titles[0].height + this.titles[0].padding;
  }

  set(index) {
    each(this.titles, (title, titleIndex) => {
      if (title && title.set) {
        title.set(index === titleIndex);
      }
    });
  }

  /**
   * Loop.
   */
  update() {
    each(this.titles, (title) => {
      if (title && title.update) {
        title.update();
      }
    });
  }

  /**
   * Destroy.
   */
  destroy() {
    this.scene.remove(this.group);
  }
}
