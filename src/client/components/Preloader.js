import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import imagesLoaded from 'imagesloaded';
import { map } from 'lodash';

import Component from '../classes/Component';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
    });

    this.loadedTextureUrl = [];
    window.TEXTURES = {};
    window.TITLE = {};

    this.textureLoader = new THREE.TextureLoader();
  }

  preload(content) {
    this.loadedTextureUrl.push(window.location.pathname);

    const images = content.querySelectorAll('img');

    const preloadImages = new Promise((resolve) => {
      imagesLoaded(content, { background: true }, resolve);
    });

    const desktopImages = map(
      appData.projects,
      (project) => project.data.desktop.url
    );

    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();

    const preloadTextures = Promise.all(
      [...desktopImages].map(
        (image) =>
          new Promise((resolve) => {
            textureLoader.load(image, (texture) => {
              window.TEXTURES[image] = texture;
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
    ]).then(() => {
      this.emit('preloaded');
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
