import gsap from 'gsap';

import Component from '../classes/Component';

export default class Navigation extends Component {
  constructor() {
    super({
      element: '.navigation',
      elements: {
        links: '.navigation__link',
        linksTexts: '.navigation__link__text',
      },
    });

    gsap.set(this.elements.linksTexts, { yPercent: 100 });
  }

  /**
   * Animations.
   */
  show(template) {
    this.clear();

    this.animateIn = gsap.timeline();

    this.animateIn
      .set(this.element, { autoAlpha: 1 })
      .fromTo(
        this.elements.linksTexts,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.5, stagger: 0.05, ease: 'power4.out' }
      )
      .set(this.elements.links, { pointerEvents: 'auto' });

    this.onChange(template);
  }

  hide() {
    this.clear();

    this.animateOut = gsap.timeline();

    this.animateOut
      .set(this.elements.links, { pointerEvents: 'none' })
      .to(this.elements.linksTexts, {
        yPercent: 100,
        duration: 1.5,
        stagger: 0.05,
        ease: 'power4.out',
      });
  }

  clear() {
    if (this.animateIn) {
      this.animateIn.kill();
      this.animateIn = null;
    }

    if (this.animateOut) {
      this.animateOut.kill();
      this.animateOut = null;
    }
  }

  /**
   * Events.
   */
  onNavigationStart() {
    this.hide();
  }

  onNavigationEnd(template) {
    this.show(template);
  }

  onChange(template) {
    gsap.set(this.element, {
      mixBlendMode: template === 'home' ? 'inherit' : 'difference',
    });
  }
}
