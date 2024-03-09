import lodash from 'lodash';

const { map } = lodash;

export function renderCase(data) {
  const { project, projectIndex, related } = data;

  return /*html*/ `
    <div class="content" id="content" data-template="case">
      <div class="case case--${project.data.type.toLowerCase()}" data-index="${projectIndex}">
        <button class="case__header__button">
          <span class="case__header__button__text">Scroll</span>
          <svg
            class="case__header__button__arrow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 6.6 17.3"
          >
            <path d="M6.3,13.7l-2.9,2.9l-3,-3M3.4,16.6V0" />
          </svg>
        </button>
        <div class="case__wrapper">
          <header class="case__header">
            <h1 class="case__header__title">${project.data.name}</h1>
          </header>
          <div class="case__content">
            <div class="case__content__wrapper">
              <section class="case__information">
                <div class="case__information__columns">
                  <p class="case__information__text">${project.data.label}</p>
                  <p class="case__information__text">/ ${project.data.year}</p>
                </div>
                <p class="case__information__description">
                  ${project.data.description}
                </p>
              </section>
              ${map(project.data.body, (item) => {
                if (item.slice_type === 'image') {
                  return /*html*/ `
                    <figure
                      class="case__image"
                      style="max-width: ${Math.min(
                        item.primary.image.dimensions.width,
                        1920
                      )}px"
                    >
                      <span class="case__image__wrapper" style="padding-top: ${
                        (item.primary.image.dimensions.height /
                          item.primary.image.dimensions.width) *
                        100
                      }%">
                        <img
                          src="${item.primary.image.url}"
                          alt="${item.primary.image.alt}"
                          class="case__image__media"
                        />
                      </span>
                    </figure>
                  `;
                }
                if (item.slice_type === 'highlight') {
                  return /*html*/ `
                    <section class="case__highlight">
                      <p class="case__highlight__text">
                        ${item.primary.highlight}
                      </p>
                    </section>
                  `;
                }
              }).join('')}
              <footer class="case__footer">
                <span class="case__footer__label">Go to</span>
                <span class="case__footer__wrapper">
                  <a href="/case/${
                    related.uid
                  }" class="case__footer__button" data-link>
                    <span
                      class="case__footer__button__text"
                      data-text="${related.data.name}"
                    >
                      ${related.data.name}
                    </span>
                    <svg
                      class="case__footer__button__arrow"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 9.2 9.2"
                      data-link-arrow
                    >
                      <path d="M8.7,2.3v6.3H2.3M8.7,8.7L0.4,0.4" />
                    </svg>
                  </a>
                </span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
