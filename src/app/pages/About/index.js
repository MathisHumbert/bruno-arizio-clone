import gsap from 'gsap';
import { each } from 'lodash';

import Page from '../../classes/Page';

export default class About extends Page {
  constructor() {
    super({
      id: 'about',
      classes: {},
      element: '.about',
      elements: {
        wrapper: '.about__wrapper',
      },
    });
  }

  create() {
    this.createLinks();
    this.createText();

    super.create();
  }

  createLinks() {
    const titleLinkElement = document.querySelectorAll('.about__title a');

    each(titleLinkElement, (link) => {
      link.classList.add('about__title__highlight');

      link.setAttribute('data-link', '');

      link.innerHTML = `
        <span class="about__title__highlight__text" data-text="${link.innerHTML}">${link.innerHTML}</span><svg class="about__title__highlight__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.2 9.2" data-link-arrow>
          <path d="M8.7,2.3v6.3H2.3 M8.7,8.7L0.4,0.4" />
        </svg>
      `;
    });

    const biographyLinkElements = document.querySelectorAll(
      '.about__description--biography a'
    );
    const lineLinkElements = document.querySelectorAll(
      '.about__description__line a'
    );
    const creditsLinkElements = document.querySelector(
      '.about__description--credits a'
    );

    each(
      [...biographyLinkElements, ...lineLinkElements, creditsLinkElements],
      (link) => {
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
      }
    );
  }

  createText() {
    const titleElement = document.querySelector('.about__title h1');
    const biographyTextElements = document.querySelectorAll(
      '.about__description--biography p'
    );
    const creditsTextElement = document.querySelector(
      '.about__description--credits p'
    );

    each(
      [titleElement, creditsTextElement, ...biographyTextElements],
      (element) => element.setAttribute('data-animation', 'text')
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
