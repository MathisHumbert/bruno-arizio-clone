import PrismicDOM from 'prismic-dom';
import lodash from 'lodash';

const { map } = lodash;

export function renderAbout(data) {
  const { about } = data;

  return /*html*/ `
    <div class="content" id="content" data-template="about">
      <div class="about">
        <div class="about__wrapper">
          <div class="about__title">
            ${PrismicDOM.RichText.asHtml(about.data.title)}
          </div>
          <div class="about__description about__description--biography">
            ${PrismicDOM.RichText.asHtml(about.data.description)}
          </div>
          <div class="about__columns">
            <div class="about__columns__column">
              <h2 class="about__subtitle" data-animation="text">${
                about.data.contact_title
              }</h2>
              <p class="about__description">
              ${map(
                about.data.contact_list,
                (contact) => /*html*/ `
                <span class="about__description__line">
                  <a href="${contact.link.url}" class="about__link" data-animation="text">${contact.text}</a>
                </span>
              `
              ).join('')}
              </p>
              <h2 class="about__subtitle" data-animation="text">${
                about.data.awards_title
              }</h2>
              <p class="about__description">
              ${map(
                about.data.awards_list,
                (award) => /*html*/ `
                <span class="about__description__line">
                  <a class="about__link" data-animation="text">${award.text}</a>
                </span>
              `
              ).join('')}
              </p>
            </div>
            <div class="about__columns__column">
              <h2 class="about__subtitle"  data-animation="text">${
                about.data.social_title
              }</h2>
              <p class="about__description">
              ${map(
                about.data.social_list,
                (social) => /*html*/ `
                <span class="about__description__line">
                  <a href="${social.link.url}" class="about__link" data-animation="text">${social.text}</a>
                </span>
              `
              ).join('')}
              </p>
            </div>
          </div>
          <div class="about__description about__description--credits">
          ${PrismicDOM.RichText.asHtml(about.data.credits)}
          </div>
        </div>
      </div>
    </div>
  `;
}
