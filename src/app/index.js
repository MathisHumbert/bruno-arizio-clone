import '../styles/index.scss';
import './utils/polyfill';
import './utils/scroll';

import AutoBind from 'auto-bind';
import each from 'lodash/each';
import NormalizeWheel from 'normalize-wheel';
import * as THREE from 'three';

import Canvas from './components/Canvas';
import Preloader from './components/Preloader';

import Responsive from './classes/Responsive';

import Home from './pages/Home';
import About from './pages/About';
import Case from './pages/Case';
import Essays from './pages/Essays';
import Index from './pages/Index';
import Navigation from './components/Navigation';
import Cursor from './components/Cursor';

export default class App {
  constructor() {
    AutoBind(this);

    this.url = window.location.href;
    this.isLoading = false;
    this.clock = new THREE.Clock();
    this.odlElapsedTime = 0;

    this.init();
  }

  init() {
    this.createResponsive();
    this.createContent();

    this.createCanvas();
    this.createPages();
    this.createPreloader();
    this.createNavigation();
    this.createCursor();

    this.addEventsListeners();
    this.addLinkListeners();

    this.update();
  }

  /**
   * Create.
   */
  createResponsive() {
    this.responsive = new Responsive();
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
  }

  createPages() {
    this.pages = {
      home: new Home(),
      about: new About(),
      case: new Case(),
      essays: new Essays(),
      index: new Index(),
    };

    this.page = this.pages[this.template];

    this.page.create(true);
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });

    this.canvas.on('change', (index) => {
      if (this.page && this.page.onCanvasChange) {
        this.page.onCanvasChange(index);
      }
    });
  }

  createNavigation() {
    this.navigation = new Navigation();
  }

  createCursor() {
    this.cursor = new Cursor(this.responsive.size);
  }

  createPreloader() {
    this.preloader = new Preloader(this.content);

    this.preloader.on('start', (texture) => {
      if (
        this.template !== 'about' &&
        this.template !== 'essays' &&
        this.template !== 'case'
      ) {
        this.canvas.createPreloader(texture);
      }
    });

    this.preloader.on('preloaded', () => this.onPreloaded());
  }

  async createLoader() {
    return new Promise(async (res) => {
      await this.preloader.load(this.content);

      await this.onLoaded(res);
    });
  }

  /**
   * Events.
   */
  async onPreloaded() {
    this.onResize();

    await this.canvas.onPreloaded(this.page.index);

    this.navigation.show(this.template);

    this.cursor.show();

    this.page.show();

    this.onResize();
  }

  async onLoaded(res) {
    this.onResize();

    await this.canvas.onLoaded(
      this.template,
      this.previousTemplate,
      this.page.index
    );

    if (this.navigation) {
      this.navigation.onNavigationEnd(this.template);
    }

    if (this.cursor) {
      this.cursor.onNavigationEnd();
    }

    this.page.show(this.canvas.index);

    res();
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push }) {
    if (url === this.url || this.isLoading) return;

    if (this.navigation) {
      this.navigation.onNavigationStart();
    }

    if (this.cursor) {
      this.cursor.onNavigationStart();
    }

    this.url = url;
    this.isLoading = true;

    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement('div');

      div.innerHTML = html;

      if (push) {
        window.history.pushState({}, '', url);
      }

      this.previousTemplate = this.template;

      const divContent = div.querySelector('.content');
      this.template = divContent.getAttribute('data-template');

      this.content.innerHTML = divContent.innerHTML;
      this.content.setAttribute('data-template', this.template);

      this.page = this.pages[this.template];

      this.page.create();

      await this.createLoader();

      this.addLinkListeners();

      this.isLoading = false;
    } else {
      console.log('error');
    }
  }

  onResize() {
    if (this.responsive && this.responsive.onResize) {
      this.responsive.onResize();
    }

    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    if (this.cursor && this.cursor.onResize) {
      this.cursor.onResize(this.responsive.size);
    }

    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }

    if (this.cursor && this.cursor.onTouchDown) {
      this.cursor.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }

    if (this.cursor && this.cursor.onTouchMove) {
      this.cursor.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }

    if (this.cursor && this.cursor.onTouchUp) {
      this.cursor.onTouchUp(event);
    }
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
  }

  /**
   * Loop.
   */
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.odlElapsedTime;
    this.odlElapsedTime = elapsedTime;

    if (this.page && this.page.update) {
      this.page.update(deltaTime);
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(deltaTime);
    }

    if (this.cursor && this.cursor.update) {
      this.cursor.update();
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners.
   */
  addEventsListeners() {
    window.addEventListener('popstate', this.onPopState, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    window.addEventListener('mousedown', this.onTouchDown, {
      passive: true,
    });
    window.addEventListener('mousemove', this.onTouchMove, {
      passive: true,
    });
    window.addEventListener('mouseup', this.onTouchUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchDown, {
      passive: true,
    });
    window.addEventListener('touchmove', this.onTouchMove, {
      passive: true,
    });
    window.addEventListener('touchend', this.onTouchUp, { passive: true });

    window.addEventListener('wheel', this.onWheel, { passive: true });
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;
      const isAnchor = link.href.indexOf('#') > -1;

      const isNotEmail = link.href.indexOf('mailto') === -1;
      const isNotPhone = link.href.indexOf('tel') === -1;

      if (isLocal) {
        link.onclick = (event) => {
          event.preventDefault();

          if (!isAnchor) {
            this.onChange({
              url: link.href,
              push: true,
            });
          }
        };
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }
}

new App();
