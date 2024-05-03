import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import imagesLoaded from 'imagesloaded';
import { map } from 'lodash';
import gsap from 'gsap';

import Component from '../classes/Component';

export default class Preloader extends Component {
  constructor(content) {
    super({
      element: '.preloader',
      elements: { numbers: '.preloader__numbers' },
    });

    this.content = content;

    this.loadedTextureUrl = [];
    window.TEXTURES = {};
    window.TITLE = {};

    this.textureLoader = new THREE.TextureLoader();

    this.texts = [
      '1 — 23',
      '23 — 1',
      '4 — 53',
      '65 — 4',
      '7 — 78',
      '78 — 9',
      '10 — 0',
    ];
    this.counter = 0;

    this.elements.numbers.textContent = this.texts[this.counter];

    this.show();
  }

  preload(content) {
    this.loadedTextureUrl.push(window.location.pathname);

    const preloadImages = new Promise((resolve) => {
      imagesLoaded(content, { background: true }, resolve);
    });

    const desktopImages = map(
      window.PROJECTS,
      (project) => project.data.desktop.url
    );

    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();

    const preloadTextures = Promise.all(
      [...desktopImages].map(
        (image, index) =>
          new Promise((resolve) => {
            textureLoader.load(image, (texture) => {
              if (index === 0) {
                this.emit('start', texture);
              }

              window.TEXTURES[image] = texture;
              this.onProgress();
              resolve();
            });
          })
      )
    );

    const loadFontAtlas = (path) => {
      const promise = new Promise((resolve) => {
        textureLoader.load(path, (atlas) => {
          window.TITLE.atlas = atlas;
          resolve();
        });
      });

      return promise;
    };

    const loadFont = (path) => {
      const promise = new Promise((resolve) => {
        fontLoader.load(path, (font) => {
          window.TITLE.font = font;
          resolve();
        });
      });

      return promise;
    };

    Promise.all([
      preloadImages,
      preloadTextures,
      loadFontAtlas('/ApercuPro-Regular.png'),
      loadFont('/ApercuPro-Regular-msdf.json'),
    ]).then(async () => {
      this.hide();
    });
  }

  onProgress() {
    this.counter += 1;

    this.elements.numbers.textContent = this.texts[this.counter];
  }

  show() {
    this.tl = gsap.timeline({
      onComplete: () => this.preload(this.content),
    });

    this.tl.fromTo(
      this.elements.numbers,
      { yPercent: 100 },
      { yPercent: 0, duration: 1.5, ease: 'power4.out' }
    );
  }

  hide() {
    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }

    this.tl = gsap.timeline({
      onComplete: () => {
        document.body.removeChild(this.element);

        this.emit('preloaded');
      },
    });

    this.tl.to(this.elements.numbers, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.out',
    });
  }

  async load(content) {
    const images = content.querySelectorAll('img');

    if (!this.loadedTextureUrl.includes(window.location.pathname)) {
      this.loadedTextureUrl.push(window.location.pathname);

      const loadImages = new Promise((resolve) => {
        imagesLoaded(content, { background: true }, resolve);
      });

      const textureLoader = new THREE.TextureLoader();

      const loadTextures = Promise.all(
        [...images].map(
          (image) =>
            new Promise((resolve) => {
              textureLoader.load(image.src, (texture) => {
                window.TEXTURES[image.src] = texture;
                resolve();
              });
            })
        )
      );

      return new Promise((res) => {
        Promise.all([loadImages, loadTextures]).then(() => {
          res();
        });
      });
    } else {
      const imgLoaded = imagesLoaded(content);

      return new Promise((res) => {
        imgLoaded.on('done', () => {
          res();
        });
      });
    }
  }
}
