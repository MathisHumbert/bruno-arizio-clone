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
