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

    super.create();
  }

  createLinks() {
    const biographyLinkElements = document.querySelectorAll(
      '.essays__about__description--biography a'
    );
    const aboutLinkElements = document.querySelectorAll('.essays__about__link');

    each([...biographyLinkElements, ...aboutLinkElements], (link) => {
      if (link.href === '') return;

      if (!link.classList.contains('about__link')) {
        link.classList.add('about__link');
      }

      link.setAttribute('data-link', ' ');

      link.innerHTML = `
          ${link.innerHTML}<svg class="about__link__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.2 9.2" data-link-arrow>
            <path d="M8.7,2.3v6.3H2.3 M8.7,8.7L0.4,0.4" />
          </svg>
        `;
    });
  }

  createText() {
    const titleElement = document.querySelector('.essays__title h1');
    const descriptionElement = document.querySelector('.essays__description');
    const descriptionAboutElements = document.querySelectorAll(
      '.essays__about__description p'
    );
    const subtitleAboutElements = document.querySelectorAll(
      '.essays__about__subtitle'
    );
    const aboutLinkElements = document.querySelectorAll('.essays__about__link');

    each(
      [
        titleElement,
        descriptionElement,
        ...descriptionAboutElements,
        ...subtitleAboutElements,
        ...aboutLinkElements,
      ],
      (element) => {
        element.setAttribute('data-animation', 'text');
      }
    );
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
