import lodash from 'lodash';

const { map } = lodash;

export function renderNavigation(data) {
  const { navigation } = data;

  return /*html*/ `
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
        (link) => /*html*/ `
        <a href="${link.link}" class="navigation__link">
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
      ).join('')}
    </nav>
  `;
}
