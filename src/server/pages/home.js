import lodash from 'lodash';

const { map } = lodash;

export function renderHome(data) {
  return /*html*/ `
    <div class="content" id="content" data-template="home">
      <div class="home">
        <div class="home__wrapper">
          ${map(
            data.projects,
            (project, index) => /*html*/ `
            <article
                class="home__project ${
                  index === 0 ? 'home__project--active' : ''
                }"
              >
                <h2 class="home__project__title">${project.data.name}</h2>
                <a href="/case/${project.uid}" class="home__project__link">
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
          ).join('')}
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
  `;
}
