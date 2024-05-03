import { each, map } from 'lodash';
import * as THREE from 'three';
import gsap from 'gsap';

import Title from './Title';

export default class Titles {
  constructor({ scene, screen, viewport }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.isAnimating = true;
    this.height = 0;
    this.group = new THREE.Group();

    this.createTitles();
  }

  createTitles() {
    this.titles = map(
      window.PROJECTS,
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
   * Animations.
   */
  show(previousTemplate, onComplete) {
    this.scene.add(this.group);

    if (
      !previousTemplate ||
      previousTemplate === 'about' ||
      previousTemplate === 'essays'
    ) {
      this.isAnimating = true;

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 2 },
        onComplete: () => {
          this.isAnimating = false;
          onComplete();
        },
      });

      tl.fromTo(
        this.group.position,
        { y: this.viewport.height * 1.66 },
        { y: 0 }
      );
    } else {
      this.isAnimating = false;

      onComplete();
    }
  }

  hide(nextTemplate) {
    if (nextTemplate === 'about' || nextTemplate === 'essays') {
      return new Promise((res) => {
        this.isAnimating = true;

        const tl = gsap.timeline({
          defaults: { ease: 'power4.out', duration: 2 },
          onComplete: () => {
            this.isAnimating = false;

            res();
            this.destroy();
          },
        });

        tl.to(this.group.position, {
          y: -this.viewport.height * 1.66 + this.height,
        });
      });
    } else {
      this.isAnimating = false;

      this.destroy();

      return Promise.resolve();
    }
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
    if (this.isAnimating) {
      return;
    }

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
    each(this.titles, (title) => {
      if (title && title.destroy) {
        title.destroy();
      }
    });

    this.scene.remove(this.group);
  }
}
