import PrismicDOM from "prismic-dom";
import lodash from "lodash";
const { map: map$5 } = lodash;
function renderAbout(data) {
  const { about } = data;
  return (
    /*html*/
    `
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
              <h2 class="about__subtitle" data-animation="text">${about.data.contact_title}</h2>
              <p class="about__description">
              ${map$5(
      about.data.contact_list,
      (contact) => (
        /*html*/
        `
                <span class="about__description__line">
                  <a href="${contact.link.url}" class="about__link" data-animation="text">${contact.text}</a>
                </span>
              `
      )
    ).join("")}
              </p>
              <h2 class="about__subtitle" data-animation="text">${about.data.awards_title}</h2>
              <p class="about__description">
              ${map$5(
      about.data.awards_list,
      (award) => (
        /*html*/
        `
                <span class="about__description__line">
                  <a class="about__link" data-animation="text">${award.text}</a>
                </span>
              `
      )
    ).join("")}
              </p>
            </div>
            <div class="about__columns__column">
              <h2 class="about__subtitle"  data-animation="text">${about.data.social_title}</h2>
              <p class="about__description">
              ${map$5(
      about.data.social_list,
      (social) => (
        /*html*/
        `
                <span class="about__description__line">
                  <a href="${social.link.url}" class="about__link" data-animation="text">${social.text}</a>
                </span>
              `
      )
    ).join("")}
              </p>
            </div>
          </div>
          <div class="about__description about__description--credits">
          ${PrismicDOM.RichText.asHtml(about.data.credits)}
          </div>
        </div>
      </div>
    </div>
  `
  );
}
const { map: map$4 } = lodash;
function renderHome(data) {
  return (
    /*html*/
    `
    <div class="content" id="content" data-template="home">
      <div class="home">
        <div class="home__wrapper">
          ${map$4(
      data.projects,
      (project, index) => (
        /*html*/
        `
            <article
                class="home__project ${index === 0 ? "home__project--active" : ""}"
              >
                <h2 class="home__project__title">${project.data.name}</h2>
                <a href="/case/${project.uid}" class="home__project__link" data-link>
                  <span class="home__project__link__wrapper">
                    <span class="home__project__link__text"
                      >${data.home.data.explore}</span
                    >
                    <svg
                      class="home__project__link__arrow"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 17.3 6.6"
                      data-link-arrow
                    >
                      <path d="M13.7,0.4l2.9,2.9l-3,3 M16.6,3.3H0"></path>
                    </svg>
                  </span>
                </a>
            </article>`
      )
    ).join("")}
          <div class="home__pagination">
            <span class="home__pagination__wrapper">
              <span class="home__pagination__number">1</span>
              <span class="home__pagination__separator"></span>
              <div class="home__pagination__number">
                ${data.projects.length}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  `
  );
}
const { map: map$3 } = lodash;
function renderEssays(data) {
  const { essays, about } = data;
  return (
    /*html*/
    `
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
              ${map$3(
      essays.data.list,
      (item) => (
        /*html*/
        `
                <li class="essays__list__item">
                  <a href="${item.link.url}" data-link class="essays__list__item__link">
                    <span class="essays__list__item__link__wrapper" data-animation="appear">
                      <span class="essays__list__item__link__text">
                      ${item.text}
                      </span>
                      <span class="essays__list__item__link__text essays__list__item__link__text--link">
                        <span>${essays.data.link}</span>
                        <svg class="essays__list__item__link__text__arrow" data-link-arrow viewBox="0 0 9.2 9.2" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.7,2.3v6.3H2.3 M8.7,8.7L0.4,0.4"></path>
                        </svg>
                      </span>
                    </span>
                    <span class="essays__list__item__dash"></span>
                  </a>
                </li>
              `
      )
    ).join("")}
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
                <h2 class="essays__about__subtitle">${about.data.contact_title}</h2>
                <p class="essays__about__description">
                  ${map$3(
      about.data.contact_list,
      (contact) => (
        /*html*/
        `
                    <span class="essays__about__description__line">
                      <a href="${contact.link.url}" class="essays__about__link" data-link>${contact.text}</a>
                    </span>
                  `
      )
    ).join("")}
                </p>
              </div>
              <div class="essays__about__columns__column">
                <h2 class="essays__about__subtitle">${about.data.social_title}</h2>
                <p class="essays__about__description">
                  ${map$3(
      about.data.social_list,
      (social) => (
        /*html*/
        `
                    <span class="essays__about__description__line">
                      <a href="${social.link.url}" class="essays__about__link" data-link>${social.text}</a>
                    </span>
                  `
      )
    ).join("")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  );
}
const { map: map$2 } = lodash;
function renderCase(data) {
  const { project, projectIndex, related } = data;
  return (
    /*html*/
    `
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
                  <p class="case__information__text" data-animation="text">${project.data.label}</p>
                  <p class="case__information__text" data-animation="text">/ ${project.data.year}</p>
                </div>
                <p class="case__information__description" data-animation="text">
                  ${project.data.description}
                </p>
              </section>
              ${map$2(project.data.body, (item) => {
      if (item.slice_type === "image") {
        return (
          /*html*/
          `
                    <figure
                      class="case__image"
                      style="max-width: ${Math.min(
            item.primary.image.dimensions.width,
            1920
          )}px"
                    >
                      <span class="case__image__wrapper" style="padding-top: ${item.primary.image.dimensions.height / item.primary.image.dimensions.width * 100}%">
                        <img
                          src="${item.primary.image.url}"
                          alt="${item.primary.image.alt}"
                          class="case__image__media"
                        />
                      </span>
                    </figure>
                  `
        );
      }
      if (item.slice_type === "highlight") {
        return (
          /*html*/
          `
                    <section class="case__highlight">
                      <p class="case__highlight__text">
                        ${item.primary.highlight}
                      </p>
                    </section>
                  `
        );
      }
    }).join("")}
              <footer class="case__footer">
                <span class="case__footer__label">Go to</span>
                <span class="case__footer__wrapper">
                  <a href="/case/${related.uid}" class="case__footer__button" data-link>
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
  `
  );
}
const { map: map$1 } = lodash;
function renderIndex(data) {
  return (
    /*html*/
    `
    <div class="content" id="content" data-template="index">
      <div class="index">
        <div class="index__wrapper">
          ${map$1(
      data.projects,
      (project) => (
        /*html*/
        `
            <a href="/case/${project.uid}" class="index__link" data-link>
              <svg class="index__link__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.2 9.2" data-link-arrow>
                <path d="M8.7,2.3v6.3H2.3 M8.7,8.7L0.4,0.4"></path>
              </svg>
            </a>
          `
      )
    ).join("")}
        </div>
      </div>
    </div>
  `
  );
}
function renderHead(data) {
  return (
    /*html*/
    `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title>${data.meta ? data.meta.title : "Title"}</title>
    <meta
      name="description"
      content="${data.meta ? data.meta.description : ""}"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="${data.meta ? data.meta.icon : ""}"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="${data.meta ? data.meta.icon : ""}"
    />
    <link
      rel="mask-icon"
      href="/safari-pinned-tab.svg"
      color="${data.meta ? data.meta.icon : ""}"
    />
    <meta
      name="msapplication-TileColor"
      content="${data.meta ? data.meta.color : ""}"
    />
    <meta name="theme-color" content="${data.meta ? data.meta.color : ""}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${data.meta ? data.meta.title : ""}" />
    <meta
      property="og:description"
      content="${data.meta ? data.meta.description : ""}"
    />
    <meta property="og:image" content="${data.meta ? data.meta.image : ""}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${data.meta ? data.meta.title : ""}" />
    <meta
      name="twitter:description"
      content="${data.meta ? data.meta.description : ""}"
    />
    <meta name="twitter:image" content="${data.meta ? data.meta.image : ""}" />
    `
  );
}
const { map } = lodash;
function renderNavigation(data) {
  const { navigation } = data;
  return (
    /*html*/
    `
    <nav class="navigation">
      <a href="/" class="navigation__link" data-link>
        <span class="navigation__link__wrapper" data-link-magnet>
          <span>
            <span class="navigation__link__text">
              ${navigation.data.logo}
            </span>
          </span>
        </span>
        <span class="navigation__link__dot"></span>
      </a>
      ${map(
      navigation.data.links,
      (link) => (
        /*html*/
        `
        <a href="${link.link}" class="navigation__link" data-link>
          <span class="navigation__link__wrapper" data-link-magnet>
            <span>
              <span class="navigation__link__text">
                ${link.text}
              </span>
            </span>
          </span>
          <span class="navigation__link__dot"></span>
        </a>
      `
      )
    ).join("")}
    </nav>
  `
  );
}
function renderPreloader() {
  return (
    /*html*/
    `
    <div class="preloader">
      <span class="preloader__text">
        <span class="preloader__numbers"></span>
      </span>
    </div>
  `
  );
}
async function render(templace, data) {
  let html = "";
  html += renderPreloader();
  html += renderNavigation(data);
  html += /*html*/
  `
  <div class="cursor">
    <canvas class="cursor__canvas"></canvas>
  </div>
  `;
  const head = renderHead(data);
  const script = (
    /*html*/
    `
    <script>
      const appData = ${JSON.stringify(data)};
    <\/script>
  `
  );
  if (templace === "home") {
    html += renderHome(data);
  }
  if (templace === "about") {
    html += renderAbout(data);
  }
  if (templace === "essays") {
    html += renderEssays(data);
  }
  if (templace === "index") {
    html += renderIndex(data);
  }
  if (templace === "case") {
    html += renderCase(data);
  }
  return { html, head, script };
}
export {
  render
};
