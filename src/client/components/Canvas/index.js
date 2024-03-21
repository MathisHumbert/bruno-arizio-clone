import * as THREE from 'three';
import EventEmitter from 'events';

import Home from './Home';
import About from './About';
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

    this.home.destroy();
    this.home = null;
  }

  /**
   * About.
   */
  createAbout() {
    this.about = new About({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
    });
  }

  destroyAbout() {
    if (!this.about) return;

    this.about.destroy();
    this.about = null;
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

    this.case.destroy();
    this.case = null;
  }

  /**
   * Events.
   */
  onPreloaded(index) {
    this.onChangeEnd(this.template, null, index);
  }

  onLoaded(template, previousTemplate, index) {
    this.onChangeEnd(template, previousTemplate, index);
  }

  onChangeStart() {
    if (this.home) {
      this.home.hide();
    }

    if (this.about) {
      this.about.hide();
    }

    if (this.case) {
      this.case.hide();
    }
  }

  onChangeEnd(template, previousTemplate, index) {
    this.previousPage = this.currentPage;
    this.currentPage = null;

    if (index !== undefined) {
      this.onIndexChange(index);
    }

    if (this.home) {
      this.destroyHome();
    }

    if (this.about) {
      this.destroyAbout();
    }

    if (this.case) {
      this.destroyCase();
    }

    if (template === 'home') {
      this.createHome();

      this.home.on('change', (index) => this.onIndexChange(index));
    }

    if (template === 'about') {
      this.createAbout();
    }

    if (template === 'case') {
      this.createCase();

      this.case.show(previousTemplate);
    }

    this.currentPage = template;
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

    if (this.about && this.about.onResize) {
      this.about.onResize({ screen: this.screen, viewport: this.viewport });
    }

    if (this.case && this.case.onResize) {
      this.case.onResize({ screen: this.screen, viewport: this.viewport });
    }
  }

  onTouchDown(event) {
    if (this.home && this.home.onTouchDown) {
      this.home.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.home && this.home.onTouchMove) {
      this.home.onTouchMove(event);
    }
  }

  onTouchUp() {
    if (this.home && this.home.onTouchUp) {
      this.home.onTouchUp();
    }
  }

  onWheel(normalized) {
    if (this.home && this.home.onWheel) {
      this.home.onWheel(normalized);
    }
  }

  onIndexChange(index) {
    this.index = index;

    this.emit('change', index);
  }

  /**
   * Loop.
   */
  update(scroll, deltaTime) {
    if (this.home && this.home.update) {
      this.home.update(deltaTime);
    }

    if (this.about && this.about.update) {
      this.about.update(scroll);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
