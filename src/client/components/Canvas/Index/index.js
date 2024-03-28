import * as THREE from 'three';
import gsap from 'gsap';
import { debounce, each } from 'lodash';
import EventEmitter from 'events';

import Background from './Background';
import Titles from './Titles';
import { clamp, lerp } from '../../../utils/math';

export default class Index extends EventEmitter {
  constructor({ scene, camera, geometry, screen, viewport, index }) {
    super();
    this.name = 'Index';

    this.scene = scene;
    this.camera = camera;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.index = index;

    this.linkElements = document.querySelectorAll('.index__link');
    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };
    this.isAnimating = true;

    this.onCheckDebounce = debounce(this.onCheck, 400);

    this.createTitles();
    this.createBackground();

    this.set(this.index);
  }

  createTitles() {
    this.titles = new Titles({
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
    });

    this.scroll.limit = this.titles.height * (this.titles.titles.length - 1);
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

    if (this.titles && this.titles.show) {
      this.titles.show(previousTemplate, () => {
        this.isAnimating = false;
        this.set(this.index);
      });
    }
  }

  hide(nextTemplate) {
    let promises = [];
    this.isAnimating = true;

    if (this.background) {
      const promise = this.background.hide(nextTemplate);

      promises.push(promise);
    }

    if (this.titles && this.titles.hide) {
      const promise = this.titles.hide(nextTemplate);

      promises.push(promise);
    }

    return Promise.all(promises);
  }

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

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!this.isDown) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = this.start - y;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;

    this.onCheck();
  }

  onWheel(normalized) {
    const value = normalized.pixelY > 0 ? 1 : -1;

    this.scroll.target += this.titles.height * value;

    this.onCheckDebounce();
  }

  onCheck() {
    this.scroll.target = this.titles.height * this.index;
  }

  set(index) {
    this.index = index;

    this.scroll.target = this.scroll.current = this.titles.height * this.index;
    this.titles.group.position.y = this.scroll.current;

    if (this.titles && this.titles.set) {
      this.titles.set(index);
    }

    if (this.background && this.background.set) {
      this.background.set(index);
    }

    this.calculate();
  }

  /**
   * Loop.
   */
  update() {
    if (this.isAnimating) return;

    const index = Math.round(this.titles.group.position.y / this.titles.height);

    if (this.index !== index) {
      this.index = index;

      this.emit('change', this.index);

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

    if (
      this.titles.group.position.y.toFixed(3) !== this.scroll.target.toFixed(3)
    ) {
      this.calculate();
    }

    if (this.titles && this.titles.update) {
      this.titles.update();
    }

    if (this.background && this.background.update) {
      this.background.update(index);
    }
  }

  calculate() {
    const position = new THREE.Vector3();
    const box = new THREE.Box3();

    each(this.titles.titles, (title, childIndex) => {
      box.setFromObject(title.mesh);

      const min = box.min.clone().project(this.camera);
      const max = box.max.clone().project(this.camera);

      const minX = (min.x / 2) * this.screen.width;
      const maxX = (max.x / 2) * this.screen.width;

      const minY = (min.y / 2) * this.screen.height;
      const maxY = (max.y / 2) * this.screen.height;

      const height = maxY - minY;
      const width = maxX - minX;

      title.mesh.updateMatrixWorld();
      title.mesh.getWorldPosition(position);

      position.project(this.camera);

      position.x = Math.round(((position.x + 1) * this.screen.width) / 2);
      position.y = Math.round(((-position.y + 1) * this.screen.height) / 2);
      position.z = 0;

      const link = this.linkElements[childIndex];

      gsap.set(link, {
        height,
        width,
        x: position.x,
        y: position.y - height / 1.2,
      });

      if (this.index === childIndex) {
        link.classList.add('index__link--active');
      } else {
        link.classList.remove('index__link--active');
      }
    });
  }
}
