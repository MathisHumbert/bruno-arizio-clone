import { clamp, lerp } from '../../../utils/math';
import Background from './Background';
import Titles from './Titles';

export default class Index {
  constructor({ scene, geometry, screen, viewport }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };
    this.index = 0;

    this.createTitles();
    this.createBackground();

    this.set(0);
  }

  createTitles() {
    this.titles = new Titles({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  createBackground() {
    const textures = appData.projects.map(
      (project) => window.TEXTURES[project.data.desktop.url]
    );

    this.background = new Background({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      textures,
    });
  }

  /**
   * Animations.
   */
  show() {}

  hide() {}

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    if (this.titles && this.titles.onResize) {
      this.titles.onResize({ screen, viewport });
    }

    if (this.background && this.background.onResize) {
      this.background.onResize({ screen, viewport });
    }

    this.scroll.limit = this.titles.height * (this.titles.titles.length - 1);
  }

  onTouchDown(event) {
    this.isDown = true;
  }

  onTouchMove(event) {
    if (!this.isDown) return;
  }

  onTouchUp() {
    this.isDown = false;
  }

  onWheel(normalized) {
    const value = normalized.pixelY > 0 ? 1 : -1;

    this.scroll.target += this.titles.height * value;
  }

  set(index) {
    if (this.titles && this.titles.set) {
      this.titles.set(index);
    }

    if (this.background && this.background.set) {
      this.background.set(index);
    }
  }

  /**
   * Loop.
   */
  update() {
    const index = Math.round(this.titles.group.position.y / this.titles.height);

    if (this.index !== index) {
      this.index = index;

      if (this.titles && this.titles.set) {
        this.titles.set(this.index);
      }
    }

    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    this.titles.group.position.y = this.scroll.current;

    if (this.titles && this.titles.update) {
      this.titles.update();
    }

    if (this.background && this.background.update) {
      this.background.update(index);
    }
  }
}
