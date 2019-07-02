'use strict';

const debug = require('debug')('site:app');
// const path = require('path');
// const compression = require('compression');
// const helmet = require('helmet');
const express = require('express');
// const fs = require('fs-extra');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const redis = require('redis');
const ExpressSession = require('express-session');
const RedisStore = require('connect-redis')(ExpressSession);
const _ = require('lodash');
/**
  functions
*/
const fetchJsonData = require('./lib/fetch-json-data');
const pickAvailableLang = require('./lib/pick-available-lang');
const site = require('./site');

const middleware = require('./middleware');

const app = express();
/*
  'hard' application-level constants
*/
const { SOURCE_DATA_HOSTNAME } = process.env; /** !!!!! THIS IS REQUIRED AND WILL BE CHECKED !!!!! */
// these necessary for authenticating users to access the CMS
const {
  USERS_PATH, CMS_AUTHENTICATION_ROUTE, SESSION_NAME, SESSION_SECRET,
} = process.env;
const PATH_PREFIX = process.env.PATH_PREFIX || ''; /** optional */
const SITE_VERSION = process.env.SITE_VERSION || ''; /** optional */
// const SERVER_START_TIME = getNewTimestamp();
const REGION_DEFS_PATHNAME = 'json/region-defs.json';
const PRESERVED_QUERY_STRINGS = ['role', 'token'];
const SESSION_TTL = 12 * 3600; /** limit edit sessions to 12 hours */
/*
  application-level constants ('soft') set using an initial call to the API (below)
*/
let LANGS;
/**
  check .env settings necessary for running the app and exit if not met
*/
if (!SOURCE_DATA_HOSTNAME) {
  debug('APP_SETUP_ERROR: the environment variable SOURCE_DATA_HOSTNAME is required but has not been set.');
  process.exit(1);
}
/**
  make sure all views specified in ROUTE_DEFS actually exist
*/
try {
  site.assertValidRouting();
} catch (err) {
  debug('APP_SETUP_ERROR: attempt to assert vailid site routing (that each routing definition specifies a view that exists) resulted in the following error:');
  debug(err);
  process.exit(1);
}
/**
  check for USERS_PATH, CMS_AUTHENTICATION_ROUTE, SESSION_NAME, and SESSION_SECRET in .env and issue a warning if unavailable
*/
if (!CMS_AUTHENTICATION_ROUTE) {
  debug('APP_SETUP_WARNING: the environment variable CMS_AUTHENTICATION_ROUTE must be set --no users will have CMS access.');
}
if (!USERS_PATH) {
  debug('APP_SETUP_WARNING: the environment variable USERS_PATH must be set --no users will have CMS access.');
}
if (!(SESSION_NAME && SESSION_SECRET)) {
  debug('APP_SETUP_WARNING: the environment variables SESSION_NAME and SESSION_SECRET must be set--no users will have CMS access.');
}
/**
  Set up Redis/Express session store
*/
if (SESSION_NAME && SESSION_SECRET) {
  app.use(ExpressSession({
    store: new RedisStore({
      client: redis.createClient(),
      ttl: SESSION_TTL,
      logErrors: true,
    }),
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    saveUninitialized: false,
    unset: 'destroy',
    resave: false,
  }));
}
/**
  fetch necessary (soft) constants from the API and exit if unable to do so
*/
fetchJsonData(REGION_DEFS_PATHNAME, process.env.SOURCE_DATA_HOSTNAME)
  .then((data) => {
    LANGS = _.get(data, 'env.langs');
    const REGION_DEFS = _.get(data, 'regionDefs', []);
    if (!(Array.isArray(REGION_DEFS) && (REGION_DEFS.length))) {
      debug('APP_SETUP_ERROR: the API did not return a valid "regionDefs" Array.');
      process.exit(1);
    }
    if (!(Array.isArray(LANGS) && (LANGS.length))) {
      debug('APP_SETUP_WARNING: the API did not return a valid "langs" Array (it is expected inside an "env" Object). The app is running in fallback "en" only mode');
      LANGS = ['en'];
    }
    site.setConstants({
      SOURCE_DATA_HOSTNAME,
      PATH_PREFIX,
      SITE_VERSION,
      REGION_DEFS,
      LANGS,
    });
  })
  .catch((err) => {
    debug('APP_SETUP_ERROR: Call to API failed upon attempt to fetch region defs. The following error response was received:');
    debug(err);
    process.exit(1);
  });
/**
  custom middleware
  NOTE: all custom middleware (inside the middleware/ directory) are functions
*/
app.use(middleware.quick404(require('./etc/routes-that-404')));

if (USERS_PATH) {
  app.use(middleware.userAuthentication(CMS_AUTHENTICATION_ROUTE, USERS_PATH));
}
/**
  normal routing
*/
app.use('/:routePrefix?/:routeName?/:regionId?', async (req, res, next) => {
  const context = {
    query: {},
    routeName: '',
    lang: '',
    regionId: '',
    user: req.session.user || '', /* authenticated user (handled by middleware) */
  };
  // let regionDef;
  const pathSegments = req.baseUrl.split('/');
  pathSegments.splice(0, 1);
  // these are preserved regardless (even through a redirect) so do them first
  PRESERVED_QUERY_STRINGS.forEach((queryKey) => {
    if (req.query[queryKey]) context.query[queryKey] = req.query[queryKey];
  });

  if ((pathSegments[0] || '').length !== 2) {
    // first segment is NOT a 2-character lang code -- assume that it was intended to be the routeName and redirect accordingly
    context.lang = pickAvailableLang(LANGS, req); // preferred available lang
    context.routeName = pathSegments[0] || '';
    context.regionId = pathSegments[1] || '';
    // make sure route parameters are valid before bothering to do a redirect
    try {
      site.assertValidRoute(context);
    } catch (err) {
      next(err);
      return;
    }
    res.redirect(site.getHref(context));
    return;
  }
  /**
    At this point, the route is of the proper form: /lc/routeName/regionId where lc (language code) is 2 characters
  */
  context.lang = pickAvailableLang(LANGS, req, pathSegments[0].toLowerCase());
  context.routeName = pathSegments[1] || '';
  context.regionId = pathSegments[2] || '';
  // make sure route parameters are valid before bothering to do a redirect
  try {
    site.assertValidRoute(context);
  } catch (err) {
    next(err);
    return;
  }
  // make sure requested lang is supported
  if (context.lang !== pathSegments[0].toLowerCase()) {
    // redirect to availableLang, preserving all other paramters
    res.redirect(site.getHref(context));
    return;
  }
  // at this point, the request is valid
  const content = await site.renderPage(context);
  res.send(content);
});
/**
 * Error route handler
 * NOTE: "next" MUST BE in the callback for express to properly recognize this as an error route
 */
app.use(async (err, req, res, next) => {
  let content;
  if (err.context) {
    content = await site.renderPage(err.context, err.message);
    res.status(err.status || 500).send(content);
    return;
  }
  // This is an unanticipated problem -- log the error and attempt to display the home page with a 500
  debug(err);

  content = await site.renderPage({
    query: {},
    routeName: '',
    lang: 'en',
    regionId: '',
    user: req.session.user || '',
  });
  res.status(500).send(content);
});

module.exports = app;
