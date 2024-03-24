import gsap from 'gsap';
import { each } from 'lodash';

import Page from '../../classes/Page';

export default class Essays extends Page {
  constructor() {
    super({
      id: 'essays',
      classes: {},
      element: '.essays',
      elements: {
        wrapper: '.essays__wrapper',
      },
    });
  }

  create() {
    this.createLinks();
    this.createText();
    this.createAppear();

    super.create();
  }

  createLinks() {}

  createText() {
    const titleElement = document.querySelector('.essays__title h1');

    each([titleElement], (element) => {
      console.log(element);
      element.setAttribute('data-animation', 'text');
    });
  }

  createAppear() {}

  /**
   * Animations.
   */
  async show() {
    const tl = gsap.timeline();

    tl.to(this.element, { autoAlpha: 1 });

    return super.show(tl);
  }

  async hide() {
    const tl = gsap.timeline();

    tl.to(this.element, { autoAlpha: 0 });

    return super.hide(tl);
  }
}
