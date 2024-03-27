import * as THREE from 'three';
import EventEmitter from 'events';

import Home from './Home';
import Index from './Index/index';
import Case from './Case';

export default class Canvas extends EventEmitter {
  constructor({ template }) {
    super();

    this.template = template;
    this.currentPage = null;
    this.previousPage = null;
    this.index = 0;

    this.createScene();
    this.createCamera();
    this.createRender();
    this.createGeometry();

    this.onResize();
  }

  /**
   * THREE.
   */
  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.z = 300;
  }

  createRender() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 50);
  }

  /**
   * Home.
   */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  destroyHome() {
    if (!this.home) return;

    this.home = null;
  }

  /**
   * Index.
   */
  createIndex() {
    this.indexes = new Index({
      scene: this.scene,
      camera: this.camera,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      index: this.index,
    });
  }

  destroyIndex() {
    if (!this.indexes) return;

    this.indexes = null;
  }

  /**
   * Case.
   */
  createCase() {
    this.case = new Case({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      index: this.index,
    });
  }

  destroyCase() {
    if (!this.case) return;

    this.case = null;
  }

  /**
   * Events.
   */
  async onPreloaded(index) {
    await this.onChange(this.template, null, index);
  }

  async onLoaded(template, previousTemplate, index) {
    await this.onChange(template, previousTemplate, index);
  }

  async onChange(template, previousTemplate, index) {
    this.previousPage = this.currentPage;
    this.currentPage = null;

    if (index !== undefined) {
      this.onIndexChange(index);
    }

    return new Promise(async (res) => {
      if (this.home) {
        await this.home.hide(template);

        this.destroyHome();
      }

      if (this.indexes) {
        await this.indexes.hide(template);

        this.destroyIndex();
      }

      if (this.case) {
        await this.case.hide(template);

        this.destroyCase();
      }

      this.currentPage = template;

      // if (this.currentPage && template !== previousTemplate) {
      //   console.log('create transition');
      // }

      if (template === 'home') {
        this.createHome();

        this.home.show(previousTemplate);

        this.home.on('change', (index) => this.onIndexChange(index));
      }

      if (template === 'index') {
        this.createIndex();

        this.indexes.show(previousTemplate);
      }

      if (template === 'case') {
        this.createCase();

        this.case.show(previousTemplate);
      }

      res();
    });
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.home && this.home.onResize) {
      this.home.onResize({ screen: this.screen, viewport: this.viewport });
    }

    if (this.indexes && this.indexes.onResize) {
      this.indexes.onResize({ screen: this.screen, viewport: this.viewport });
    }

    if (this.case && this.case.onResize) {
      this.case.onResize({ screen: this.screen, viewport: this.viewport });
    }
  }

  onTouchDown(event) {
    if (this.home && this.home.onTouchDown) {
      this.home.onTouchDown(event);
    }

    if (this.indexes && this.indexes.onTouchDown) {
      this.indexes.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.home && this.home.onTouchMove) {
      this.home.onTouchMove(event);
    }

    if (this.indexes && this.indexes.onTouchMove) {
      this.indexes.onTouchMove(event);
    }
  }

  onTouchUp() {
    if (this.home && this.home.onTouchUp) {
      this.home.onTouchUp();
    }

    if (this.indexes && this.indexes.onTouchUp) {
      this.indexes.onTouchUp();
    }
  }

  onWheel(normalized) {
    if (this.home && this.home.onWheel) {
      this.home.onWheel(normalized);
    }

    if (this.indexes && this.indexes.onWheel) {
      this.indexes.onWheel(normalized);
    }
  }

  onIndexChange(index) {
    this.index = index;

    this.emit('change', index);
  }

  /**
   * Loop.
   */
  update(deltaTime) {
    if (this.home && this.home.update) {
      this.home.update(deltaTime);
    }

    if (this.indexes && this.indexes.update) {
      this.indexes.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
