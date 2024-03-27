import PrismicDOM from 'prismic-dom';
import lodash from 'lodash';

const { map } = lodash;

export function renderEssays(data) {
  const { essays, about } = data;

  return /*html*/ `
    <div class="content" id="content" data-template="essays">
      <div class="essays">
        <div class="essays__wrapper">
          <div class="essays__title">
            <span class="essays__title__dash"></span>
            ${PrismicDOM.RichText.asHtml(essays.data.title)}
            <span class="essays__title__dash"></span>
          </div>
          <div class="essays__list">
            <span class="essays__list__dash">
            </span>
            <ul class="essays__list__wrapper">
              ${map(
                essays.data.list,
                (item) => /*html*/ `
                <li class="essays__list__item">
                  <a href="${item.link.url}" data-link class="essays__list__item__link">
                    <span class="essays__list__item__link__wrapper" data-animation="appear">
                      <span class="essays__list__item__link__text">
                      ${item.text}
                      </span>
                      <span class="essays__list__item__link__text essays__list__item__link__text--link">
                        <span>${essays.data.link}</span>
                        <svg class="essays__list__item__link__text__arrow" data-link-arrow="" viewBox="0 0 9.2 9.2" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.7,2.3v6.3H2.3 M8.7,8.7L0.4,0.4"></path>
                        </svg>
                      </span>
                    </span>
                    <span class="essays__list__item__dash"></span>
                  </a>
                </li>
              `
              ).join('')}
            </ul>
          </div>
          <div class="essays__description">${PrismicDOM.RichText.asHtml(
            essays.data.description
          )}
          </div>
          <div class="essays__about">
            <div class="essays__about__description essays__about__description--biography">
              ${PrismicDOM.RichText.asHtml(about.data.description)}
            </div>
            <div class="essays__about__columns">
              <div class="essays__about__columns__column">
                <h2 class="essays__about__subtitle">${
                  about.data.contact_title
                }</h2>
                <p class="essays__about__description">
                  ${map(
                    about.data.contact_list,
                    (contact) => /*html*/ `
                    <span class="essays__about__description__line">
                      <a href="${contact.link.url}" class="essays__about__link">${contact.text}</a>
                    </span>
                  `
                  ).join('')}
                </p>
              </div>
              <div class="essays__about__columns__column">
                <h2 class="essays__about__subtitle">${
                  about.data.social_title
                }</h2>
                <p class="essays__about__description">
                  ${map(
                    about.data.social_list,
                    (social) => /*html*/ `
                    <span class="essays__about__description__line">
                      <a href="${social.link.url}" class="essays__about__link">${social.text}</a>
                    </span>
                  `
                  ).join('')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
