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
