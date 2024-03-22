import { each } from 'lodash';

import Page from '../../classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      classes: {
        active: 'home__project--active',
      },
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        projects: '.home__project',
        paginationNumber: '.home__pagination__number',
      },
      isScrollable: false,
    });
  }

  /**
   * Animations.
   */
  async show(index = 0) {
    this.onCanvasChange(index);

    return super.show();
  }

  async hide() {
    return super.hide();
  }

  /**
   * Events.
   */
  onCanvasChange(index) {
    this.elements.paginationNumber[0].textContent = index + 1;

    each(this.elements.projects, (project, projectIndex) => {
      if (index === projectIndex) {
        project.classList.add(this.classes.active);
      } else {
        project.classList.remove(this.classes.active);
      }
    });
  }
}
