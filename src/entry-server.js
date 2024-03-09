import { renderAbout } from './server/pages/about';
import { renderHome } from './server/pages/home';
import { renderEssays } from './server/pages/essays';
import { renderCase } from './server/pages/case';
import { renderIndex } from './server/pages';

import { renderHead } from './server/layouts/head';
import { renderNavigation } from './server/layouts/navigation';

export function render(templace, data) {
  let html = '';

  if (templace === 'home') {
    html = renderHome(data);
  }

  if (templace === 'about') {
    html = renderAbout(data);
  }

  if (templace === 'essays') {
    html = renderEssays(data);
  }

  if (templace === 'index') {
    html = renderIndex(data);
  }

  if (templace === 'case') {
    html = renderCase(data);
  }

  html += renderNavigation(data);
  html += /*html*/ `
  <div className="cursor"></div>
  <div className="scrollbar"></div>
  `;

  let head = renderHead(data);

  let script = /*html*/ `
    <script>
      const appData = ${JSON.stringify(data)};
    </script>
  `;

  return { html, head, script };
}
