import { debounce, each, map } from 'lodash';
import EventEmitter from 'events';

import Project from './Project';
import { lerp } from '../../../utils/math';

export default class Home extends EventEmitter {
  constructor({ scene, geometry, screen, viewport }) {
    super();

    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      last: 0,
      ease: 0.1,
    };
    this.isDown = 0;
    this.indexInfinite = 0;
    this.index = 0;
    this.direction = 'none';
    this.scaledViewportHeight = this.viewport.height * 1.33;

    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.onHoldEndDebounce = debounce(this.onHoldEnd, 200);

    this.createProject();
  }

  createProject() {
    this.projects = map(
      appData.projects,
      (project, index) =>
        new Project({
          scene: this.scene,
          geometry: this.geometry,
          screen: this.screen,
          viewport: this.viewport,
          texture: window.TEXTURES[project.data.desktop.url],
          name: project.data.name,
          index,
        })
    );
  }

  /**
   * Animations.
   */
  show(previousTemplate) {
    each(this.projects, (project, index) => {
      if (project && project.show) {
        project.show(this.index === index, previousTemplate);
      }
    });
  }

  hide(nextTemplate) {
    const promises = map(this.projects, (project, index) => {
      if (project && project.hide) {
        return project.hide(this.index === index, nextTemplate);
      }
    });

    return Promise.all(promises);
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.scaledViewportHeight = this.viewport.height * 1.33;
    this.heightTotal = this.scaledViewportHeight * this.projects.length;

    each(this.projects, (project) => {
      if (project && project.onResize) {
        project.onResize({ screen, viewport });
      }
    });
  }

  onTouchDown(event) {
    if (event.target.className !== 'home__wrapper') return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;

    this.onHoldStart();
  }

  onTouchMove(event) {
    if (!this.isDown) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 0.5;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;

    this.onCheck();
    this.onHoldEnd();
  }

  onWheel(normalized) {
    const speed = normalized.pixelY;

    this.scroll.target += speed * 0.25;

    this.onCheckDebounce();

    this.onHoldStart();
    this.onHoldEndDebounce();
  }

  onHoldStart() {
    each(this.projects, (project) => {
      if (project && project.onTouchStart) {
        project.onTouchStart();
      }
    });
  }

  onHoldEnd() {
    each(this.projects, (project) => {
      if (project && project.onTouchEnd) {
        project.onTouchEnd();
      }
    });
  }

  onCheck() {
    this.scroll.target = this.scaledViewportHeight * this.indexInfinite;
  }

  /**
   * Loop.
   */
  update(time) {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'up';
    } else if (this.scroll.current > this.scroll.last) {
      this.direction = 'down';
    } else {
      this.direction = 'none';
    }

    this.indexInfinite = Math.round(
      this.scroll.target / this.scaledViewportHeight
    );

    let index = this.indexInfinite % this.projects.length;

    if (this.indexInfinite < 0) {
      index =
        (this.projects.length -
          Math.abs(this.indexInfinite % this.projects.length)) %
        this.projects.length;
    }

    if (this.index !== index) {
      this.index = index;

      this.emit('change', this.index);
    }

    each(this.projects, (project) => {
      if (project) {
        project.isBefore = project.group.position.y > this.scaledViewportHeight;
        project.isAfter = project.group.position.y < -this.scaledViewportHeight;

        if (this.direction === 'down' && project.isBefore) {
          project.location -= this.heightTotal;

          project.isBefore = false;
          project.isAfter = false;
        }

        if (this.direction === 'up' && project.isAfter) {
          project.location += this.heightTotal;

          project.isBefore = false;
          project.isAfter = false;
        }

        if (project.update) {
          project.update(this.scroll.current, time);
        }
      }
    });

    this.scroll.last = this.scroll.current;
  }
}
