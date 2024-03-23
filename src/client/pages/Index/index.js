import gsap from 'gsap';

import Page from '../../classes/Page';

export default class Index extends Page {
  constructor() {
    super({
      id: 'index',
      classes: {},
      element: '.index',
      elements: {
        wrapper: '.index__wrapper',
      },
      isScrollable: false,
    });
  }

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
