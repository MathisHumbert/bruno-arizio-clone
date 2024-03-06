import { renderAbout } from './server/pages/about';
import { renderHome } from './server/pages/home';
import { renderEssays } from './server/pages/essays';
import { renderCase } from './server/pages/case';
import { renderIndex } from './server/pages';

import { renderHead } from './server/layouts/head';

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

  let head = renderHead(data);

  let script = /*html*/ `
    <script>
    ${JSON.stringify(data.assets).replace(/<\//g, '<\\/')}
    </script>
  `;

  return { html, head, script };
}
