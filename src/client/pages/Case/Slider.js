import { each } from 'lodash';
import Prefix from 'prefix';

import { getOffset } from '../../utils/dom';
import { lerp } from '../../utils/math';

export default class Slider {
  constructor({ element, items }) {
    this.element = element;
    this.items = items;

    this.scroll = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    this.direction = 'left';
    this.transformPrefix = Prefix('transform');

    this.onLeft();
    this.onResize();
  }

  /**
   * Events.
   */
  onResize() {
    this.containerWidth = this.element.clientWidth;

    each(this.items, (item) => {
      const offset = getOffset(item);
      item.offset = { ...offset, left: offset.left + this.scroll.current };
      item.extra = 0;
    });
  }

  onLeft() {
    this.direction = 'left';
    this.speed = 7.5;
  }

  onRight() {
    this.direction = 'right';
    this.speed = -7.5;
  }

  /**
   * Loop.
   */
  update(time) {
    this.scroll.target += this.speed * time * 65;

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    each(this.items, (item) => {
      const position = -this.scroll.current - item.extra;
      const offset = position + item.offset.left + item.offset.width;

      item.isBefore = offset < -this.containerWidth * 0.25;
      item.isAfter = offset > this.containerWidth * 0.75;

      if (this.direction === 'left' && item.isBefore) {
        item.extra -= this.containerWidth;

        item.isBefore = false;
        item.isAfter = false;
      }
      if (this.direction === 'right' && item.isAfter) {
        item.extra += this.containerWidth;

        item.isBefore = false;
        item.isAfter = false;
      }

      item.style[this.transformPrefix] = `translate3d(${Math.round(
        position
      )}px, 0, 0)`;
    });
  }
}
