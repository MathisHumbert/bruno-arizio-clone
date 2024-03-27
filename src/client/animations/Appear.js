import gsap from 'gsap';

import Animation from '../classes/Animation';

export default class Appear extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });
  }

  animateIn() {
    gsap.to(this.element, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.5,
      delay: 0.1,
      ease: 'power4.out',
    });

    super.animateIn();
  }

  animateOut() {
    gsap.set(this.element, { autoAlpha: 0, yPercent: 100 });

    super.animateOut();
  }
}
