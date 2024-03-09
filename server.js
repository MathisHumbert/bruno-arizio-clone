import fs from 'node:fs/promises';
import express from 'express';
import fetch from 'node-fetch';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import * as prismic from '@prismicio/client';
import path from 'path';
import lodash from 'lodash';
import 'dotenv/config';

const { find, map } = lodash;

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const base = process.env.BASE || '/';

const templateHtml = isProduction
  ? await fs.readFile(path.resolve('dist/client/index.html'), 'utf-8')
  : '';
const ssrManifest = isProduction
  ? await fs.readFile(
      path.resolve('dist/client/.vite/ssr-manifest.json'),
      'utf-8'
    )
  : undefined;

const initApi = (req) => {
  return prismic.createClient(process.env.PRISMIC_REPOSITORY, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};

const fetchDefaults = async (api) => {
  const assets = [];

  const navigation = await api.getSingle('navigation');

  const projectsList = await api.getAllByType('project');
  const projectsOrder = await api.getSingle('ordering');

  const projects = map(projectsOrder.data.list, ({ project }) =>
    find(projectsList, { uid: project.uid })
  );

  return { navigation, projects, assets };
};

const fetchHome = async (api) => {
  const home = await api.getSingle('home');

  return home;
};

const fetchAbout = async (api) => {
  const about = await api.getSingle('about');

  return about;
};

const fetchEssays = async (api) => {
  const essays = await api.getSingle('essays');

  return essays;
};

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(errorHandler());

let vite;

if (!isProduction) {
  const { createServer } = await import('vite');

  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });

  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

app.use(async (req, res, next) => {
  try {
    const url = req.originalUrl.replace(base, '');
    const api = initApi(req);

    let template;
    let render;

    if (!isProduction) {
      template = await fs.readFile(path.resolve('index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule(path.resolve('src/entry-server.js')))
        .render;
    } else {
      if (templateHtml) {
        template = templateHtml;
      } else {
        template = await fs.readFile(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      }

      render = (await import(path.resolve('dist/server/entry-server.js')))
        .render;
    }

    const defaults = await fetchDefaults(api);

    req.api = api;
    req.defaults = defaults;
    req.render = render;
    req.template = template;

    next();
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/', async (req, res) => {
  try {
    const { api, render, defaults, template } = req;

    const home = await fetchHome(api);

    const rendered = await render('home', { ...defaults, home });

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')
      .replace('<!--app-script-->', rendered.script ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/about', async (req, res) => {
  try {
    const { api, render, defaults, template } = req;

    const about = await fetchAbout(api);

    const rendered = await render('about', { ...defaults, about });

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')
      .replace('<!--app-script-->', rendered.script ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/essays', async (req, res) => {
  try {
    const { api, render, defaults, template } = req;

    const about = await fetchAbout(api);
    const essays = await fetchEssays(api);

    const rendered = await render('essays', { ...defaults, about, essays });

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')
      .replace('<!--app-script-->', rendered.script ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/index', async (req, res) => {
  try {
    const { api, render, defaults, template } = req;

    const rendered = await render('index', { ...defaults });

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')
      .replace('<!--app-script-->', rendered.script ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/case/:id', async (req, res) => {
  try {
    const { render, defaults, template } = req;
    const { projects } = defaults;

    const project = find(projects, (p) => p.uid === req.params.id);
    const projectIndex = projects.indexOf(project);
    const related = projects[projectIndex + 1]
      ? projects[projectIndex + 1]
      : projects[0];

    const rendered = await render('case', {
      ...defaults,
      project,
      projectIndex,
      related,
    });

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')
      .replace('<!--app-script-->', rendered.script ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
