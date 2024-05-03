// import fs from 'node:fs/promises';
// import path from 'path';

import { renderAbout } from './server/pages/about';
import { renderHome } from './server/pages/home';
import { renderEssays } from './server/pages/essays';
import { renderCase } from './server/pages/case';
import { renderIndex } from './server/pages';

import { renderHead } from './server/layouts/head';
import { renderNavigation } from './server/layouts/navigation';
import { renderPreloader } from './server/layouts/preloader';

export async function render(templace, data) {
  let html = '';

  // const preloader = await fs.readFile(
  //   path.resolve('src/server/layouts/preloader.html'),
  //   'utf-8'
  // );

  html += renderPreloader();
  html += renderNavigation(data);

  html += /*html*/ `
  <div class="cursor">
    <canvas class="cursor__canvas"></canvas>
  </div>
  `;

  const head = renderHead(data);

  const script = /*html*/ `
    <script>
      const appData = ${JSON.stringify(data)};
    </script>
  `;

  if (templace === 'home') {
    html += renderHome(data);
  }

  if (templace === 'about') {
    html += renderAbout(data);
  }

  if (templace === 'essays') {
    html += renderEssays(data);
  }

  if (templace === 'index') {
    html += renderIndex(data);
  }

  if (templace === 'case') {
    html += renderCase(data);
  }

  return { html, head, script };
}
