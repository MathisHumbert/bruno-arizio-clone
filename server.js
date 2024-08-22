import express from 'express';
import fetch from 'node-fetch';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';
import path from 'path';
import lodash from 'lodash';
import 'dotenv/config';

const { find, map } = lodash;

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const base = process.env.BASE || '/';

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

  return { navigation, projects, assets, prismicH, isProduction };
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

if (!isProduction) {
  app.use(logger('dev'));
  app.use(errorHandler());
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

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
  app.use(base, sirv(path.resolve('dist'), { extensions: [] }));
}

app.set('views', path.resolve('src/views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  try {
    const api = initApi(req);

    const defaults = await fetchDefaults(api);
    const home = await fetchHome(api);

    res.render('pages/home', {
      home,
      ...defaults,
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/about', async (req, res) => {
  try {
    const api = initApi(req);

    const defaults = await fetchDefaults(api);
    const about = await fetchAbout(api);

    res.render('pages/about', {
      about,
      ...defaults,
    });
  } catch (error) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/essays', async (req, res) => {
  try {
    const api = initApi(req);

    const defaults = await fetchDefaults(api);
    const about = await fetchAbout(api);
    const essays = await fetchEssays(api);

    res.render('pages/essays', {
      essays,
      about,
      ...defaults,
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/index', async (req, res) => {
  try {
    const api = initApi(req);

    const defaults = await fetchDefaults(api);

    res.render('pages/index', {
      ...defaults,
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get('/case/:id', async (req, res) => {
  try {
    const api = initApi(req);

    const defaults = await fetchDefaults(api);
    const { projects } = defaults;

    const project = find(projects, (p) => p.uid === req.params.id);
    const projectIndex = projects.indexOf(project);
    const related = projects[projectIndex + 1]
      ? projects[projectIndex + 1]
      : projects[0];

    res.render('pages/case', {
      ...defaults,
      project,
      projectIndex,
      related,
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.use((req, res, next) => {
  try {
    res.redirect('/');
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
