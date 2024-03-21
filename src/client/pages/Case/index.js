import gsap from 'gsap';
import SplitType from 'split-type';

import Page from '../../classes/Page';
import Slider from './Slider';

export default class Case extends Page {
  constructor() {
    super({
      id: 'case',
      classes: {},
      element: '.case',
      elements: {
        wrapper: '.case__wrapper',
        headerButton: '.case__header__button',
        highlightsText: '.case__highlight__text',
      },
    });
  }

  create() {
    super.create();

    this.index = Number(this.element.dataset.index);

    const items = new SplitType(this.elements.highlightsText, {
      types: 'word',
      tagName: 'span',
      wordClass: '',
    }).words;

    this.slider = new Slider({
      element: this.elements.highlightsText,
      items,
    });
  }

  /**
   * Animations.
   */
  async show() {
    const tl = gsap.timeline();

    tl.to(this.element, { autoAlpha: 1 }).fromTo(
      this.elements.headerButton,
      { autoAlpha: 0 },
      { autoAlpha: 1 },
      0
    );

    return super.show(tl);
  }

  async hide() {
    return super.hide();
  }

  /**
   * Events.
   */
  onResize() {
    super.onResize();

    if (this.slider && this.slider.onResize) {
      this.slider.onResize();
    }
  }

  onWheel(normalized) {
    super.onWheel(normalized);

    const speed = normalized.pixelY;

    if (speed < 0) {
      this.slider.onRight();
    } else if (speed > 0) {
      this.slider.onLeft();
    }
  }

  /**
   * Loop.
   */
  update(time) {
    super.update(time);

    if (this.slider && this.slider.update) {
      this.slider.update(time);
    }
  }
}
