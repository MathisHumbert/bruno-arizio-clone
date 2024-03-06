import Page from '../../classes/Page';

export default class Case extends Page {
  constructor() {
    super({
      id: 'case',
      classes: {},
      element: '.case',
      elements: {
        wrapper: '.case__wrapper',
      },
    });
  }

  /**
   * Animations.
   */
  async show() {
    return super.show();
  }

  async hide() {
    return super.hide();
  }
}
