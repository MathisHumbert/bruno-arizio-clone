import lodash from 'lodash';

const { map } = lodash;

export function renderIndex(data) {
  return /*html*/ `
    <div class="content" id="content" data-template="index">
      <div class="index">
        <div class="index__wrapper">
          ${map(
            data.projects,
            (project) => /*html*/ `
            <a href="/case/${project.uid}" class="index__link" data-link>
              <svg class="index__link__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.2 9.2" data-link-arrow>
                <path d="M8.7,2.3v6.3H2.3 M8.7,8.7L0.4,0.4"></path>
              </svg>
            </a>
          `
          ).join('')}
        </div>
      </div>
    </div>
  `;
}
