import autoBind from 'auto-bind';
import EventEmitter from 'events';
import { each } from 'lodash';
import Prefix from 'prefix';
import gsap from 'gsap';

import AsyncLoad from '../classes/AsyncLoad';
import { Detection } from '../classes/Detection';

import Text from '../animations/Text';
import Appear from '../animations/Appear';

import { clamp, lerp } from '../utils/math';
import { mapEach } from '../utils/dom';
import { COLOR_GRAY, COLOR_WHITE } from '../utils/colors';

export default class Page extends EventEmitter {
  constructor({ classes, id, element, elements, isScrollable = true }) {
    super();

    autoBind(this);

    this.classes = { ...classes };
    this.id = id;
    this.selectors = {
      element,
      elements: {
        preloaders: '[data-src]',
        pagePreloaders: '[data-page-src]',

        animationsTexts: '[data-animation="text"]',
        animationsAppears: '[data-animation="appear"]',

        ...elements,
      },
    };
    this.isScrollable = isScrollable;

    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };

    this.transformPrefix = Prefix('transform');

    this.isVisible = false;
  }

  create() {
    this.animations = [];

    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors.elements, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements[key] = selector;
      } else if (Array.isArray(selector)) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });

    if (this.isScrollable) {
      this.scroll = {
        position: 0,
        current: 0,
        target: 0,
        limit: this.elements.wrapper.clientHeight - window.innerHeight,
        ease: 0.1,
      };
    }

    this.createAnimations();
    this.createObserver();
    this.createPreloaders();
  }

  /**
   * Animations.
   */
  createAnimations() {
    /**
     * Text.
     */
    this.animationsText = mapEach(this.elements.animationsTexts, (element) => {
      return new Text({ element });
    });

    this.animations.push(...this.animationsText);

    /**
     * Appear.
     */
    this.animationsAppear = mapEach(
      this.elements.animationsAppears,
      (element) => {
        return new Appear({ element });
      }
    );

    this.animations.push(...this.animationsAppear);
  }

  /**
   * Observer.
   */
  createObserver() {
    this.observer = new window.ResizeObserver((entries) => {
      let shouldUpdateLimit = false;

      for (const _entry of entries) {
        if (_entry.target === this.elements.wrapper) {
          shouldUpdateLimit = true;
          break;
        }
      }

      if (shouldUpdateLimit) {
        window.requestAnimationFrame(() => {
          this.scroll.limit =
            this.elements.wrapper.clientHeight - window.innerHeight;
        });
      }
    });

    this.observer.observe(this.elements.wrapper);
  }

  /**
   * Loaders.
   */
  createPreloaders() {
    this.preloaders = mapEach(
      this.elements.preloaders,
      (element) =>
        new AsyncLoad({
          element,
        })
    );
  }

  /**
   * Animations.
   */
  reset() {
    this.scroll = {
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.1,
    };
  }

  set(value) {
    this.scroll.current = this.scroll.target = this.scroll.last = value;

    this.transform(this.elements.wrapper, this.scroll.current);
  }

  show(animation) {
    each(this.animations, (animation) => animation.createAnimation());

    this.addEventListeners();

    if (this.id === 'about') {
      gsap.to(document.body, {
        backgroundColor: COLOR_WHITE,
        color: COLOR_GRAY,
      });
    } else {
      gsap.to(document.body, {
        backgroundColor: COLOR_GRAY,
        color: COLOR_WHITE,
      });
    }

    if (animation) {
      return new Promise((resolve) => {
        animation.call(() => {
          this.isVisible = true;

          resolve();
        });
      });
    } else {
      this.isVisible = true;

      return Promise.resolve();
    }
  }

  hide(animation) {
    this.isVisible = false;

    this.removeEventListeners();

    each(this.animations, (animation) => animation.destroyAnimation());

    this.reset();

    if (animation) {
      return new Promise((resolve) => {
        animation.call(() => {
          resolve();
        });
      });
    } else {
      return Promise.resolve();
    }
  }

  transform(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(
      y
    )}px, 0)`;
  }

  /**
   * Events.
   */
  onResize() {
    if (!this.elements.wrapper) return;

    window.requestAnimationFrame(() => {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;

      each(this.animations, (animation) => {
        if (animation.onResize) {
          animation.onResize();
        }
      });
    });
  }

  onTouchDown(event) {
    if (!Detection.isMobile || !this.isVisible) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!Detection.isMobile || !this.isDown || !this.isVisible) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 3;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (!Detection.isMobile || !this.isVisible) return;

    this.isDown = false;
  }

  onWheel(normalized) {
    if (!this.isVisible) return;

    const speed = normalized.pixelY;

    this.scroll.target += speed;

    return speed;
  }

  /**
   * Listeners.
   */
  addEventListeners() {}

  removeEventListeners() {}

  /**
   * Loop.
   */
  update() {
    if (!this.isScrollable || !this.isVisible) return;

    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.target === 0) {
      this.scroll.current = Math.floor(this.scroll.current);
    } else {
      this.scroll.current = Math.ceil(this.scroll.current);
    }

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper, this.scroll.current);
    }

    each(this.animations, (animation) => {
      if (animation.update) {
        animation.update(this.scroll);
      }
    });

    this.scroll.last = this.scroll.current;
  }
}
