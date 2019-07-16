'use strict';

const debug = require('debug')('site:render');
const ejs = require('ejs');
const get = require('lodash.get');
const path = require('path');
const fs = require('fs-extra');

const TRANSLATION_DEFS = require('./etc/translation-defs');

const VIEWS_PATH = path.join(__dirname, 'views/pages');
const VIEWS = {};
['frameworks', 'home', 'jurisdictional-forest-monitoring', 'jurisdictional-overview', 'national-overview', 'partnerships'].forEach((viewName) => {
  const filename = path.join(VIEWS_PATH, `${viewName}.ejs`);
  VIEWS[viewName] = ejs.compile(fs.readFileSync(filename, 'utf8'), { cache: true, filename, rmWhitespace: false });
});
/**
  support functions
*/
const {
  getNewTimestamp,
  fetchJsonData,
  findRegionDefinition,
  pickTranslation,
  pickTranslationDef,
} = require('./lib');
/**
  error functions
*/
const { RegionNotFoundError, RouteNotFoundError } = require('./etc/errors');
/**
  routes and views
*/
const ROUTE_DEFS = require('./etc/route-defs');
// const VIEWS = require('./views');
/**
  site constants
*/
let PATH_PREFIX = '';
let SITE_VERSION = '';
let SOURCE_DATA_HOSTNAME = '';
let REGION_DEFS = [];
let SERVER_START_TIME = '';
let LANGS = [];
const JURISDICTIONAL_ROUTES = ROUTE_DEFS.filter(d => (['jurisdictional', 'regional'].includes(d.namespace)));
const NATIONAL_ROUTES = ROUTE_DEFS.filter(d => (['national', 'regional'].includes(d.namespace)));
const JURISDICTIONAL_ROUTE_NAMES = JURISDICTIONAL_ROUTES.map(d => d.routeName);
const NATIONAL_ROUTE_NAMES = NATIONAL_ROUTES.map(d => d.routeName);

const setConstants = (keyValuePairs) => {
  SERVER_START_TIME = getNewTimestamp();
  ({
    SOURCE_DATA_HOSTNAME,
    PATH_PREFIX,
    SITE_VERSION,
    REGION_DEFS,
    LANGS,
  } = keyValuePairs);
};
/*
  function to return an internal href for creating valid links based on site settings and request context
*/
const getHref = (context) => {
  // const props = Object.assign({}, locals, overrides);
  const segments = [];
  const queryStringParams = [];
  if (PATH_PREFIX) segments.push(PATH_PREFIX);
  if (context.lang) segments.push(context.lang);
  if (context.routeName) {
    segments.push(context.routeName);
    if (context.regionId) segments.push(context.regionId);
    else if (context.jurisdictionId) segments.push(context.jurisdictionId);
    else if (context.nationId) segments.push(context.nationId);
  }
  if (context.query) {
    Object.entries(context.query).forEach(([key, value]) => {
      queryStringParams.push(`${key}=${value}`);
    });
  }
  let href = `/${segments.join('/')}`;
  if (queryStringParams.length) href += `?${queryStringParams.join('&')}`;
  return href;
};

/**
  make sure all views specified in ROUTE_DEFS actually exist
*/
const assertValidRouting = () => {
  ROUTE_DEFS.forEach((routeDef) => {
    const viewName = routeDef.viewName || routeDef.routeName || '';
    if (!VIEWS[viewName]) {
      throw new Error(`APP_SETUP_ERROR: routeDef with routeName "${routeDef.routeName}" specifies a viewName "${viewName}" but no such view has been defined in ${VIEWS_PATH}`);
    }
  });
};

const assertValidRoute = (context) => {
  const routeDef = ROUTE_DEFS.find(d => (d.routeName === context.routeName));
  if (!routeDef) {
    const message = pickTranslation(TRANSLATION_DEFS, context.lang || 'en', 'RouteNotFoundError', 'message');
    throw new RouteNotFoundError(Object.assign(context, { routeName: '', regionId: '' }), message);
  }
  if (context.regionId && !findRegionDefinition(REGION_DEFS, context.regionId)) {
    const message = pickTranslation(TRANSLATION_DEFS, context.lang || 'en', 'RegionNotFoundError', 'message');
    throw new RegionNotFoundError(Object.assign(context, { routeName: '', regionId: '' }), message);
  }
  return true;
};

const renderPage = async (context, message = '') => {
  const routeDef = ROUTE_DEFS.find(d => (d.routeName === context.routeName));
  const viewName = routeDef.viewName || '';
  const regionDef = findRegionDefinition(REGION_DEFS, context.regionId);
  const jurisdictionalRouteName = JURISDICTIONAL_ROUTE_NAMES.includes(context.routeName) ? context.routeName : JURISDICTIONAL_ROUTE_NAMES[0];
  const nationalRouteName = NATIONAL_ROUTE_NAMES.includes(context.routeName) ? context.routeName : NATIONAL_ROUTE_NAMES[0];
  let namespace = '';
  if (context.regionId) namespace = (context.regionId.split('.').length === 1) ? 'national' : 'jurisdictional';
  let subnavRouteDefs = [];
  if (context.regionId) subnavRouteDefs = (namespace === 'national') ? NATIONAL_ROUTES : JURISDICTIONAL_ROUTES;
  // these are the langs offered as sources for Google translation
  const srcLangs = [];
  if (context.lang !== 'en') srcLangs.push('en'); // always include 'en' unless it's the current language
  // include the current region's lang unless it's 'en', the current lang, or already included
  if (regionDef && regionDef.lang && (regionDef.lang !== srcLangs[0])) {
    if ((regionDef.lang !== 'en') && (regionDef.lang !== context.lang)) srcLangs.push(regionDef.lang);
  }
  // additional "instance" properties as part of context
  const instance = {
    user: context.user,
    cmsIsEnabled: Boolean(context.user), /** for now, simply enable the CMS for any validated user  */
    lang: context.lang,
    srcLangs,
    routeDef,
    viewName,
    regionDef,
    nationalRouteName,
    jurisdictionalRouteName,
    namespace,
    subnavRouteDefs,
  };
  const constants = {
    PATH_PREFIX,
    SITE_VERSION,
    SOURCE_DATA_HOSTNAME,
    ROUTE_DEFS,
    REGION_DEFS,
    SERVER_START_TIME,
    LANGS,
  };
  const local = Object.assign({ footnotes: [], citations: [] }, instance, context, constants);
  local.data = {};
  // functions
  local.getHref = (options) => {
    return getHref({
      lang: get(options, 'lang', context.lang),
      routeName: get(options, 'routeName', context.routeName),
      regionId: get(options, 'regionId', context.regionId),
      query: get(options, 'query', context.query),
    });
  };
  local.getTranslation = (id, property = 'label') => {
    return pickTranslation(TRANSLATION_DEFS, context.lang, id, property);
  };
  local.getTranslationDef = (id) => {
    return pickTranslationDef(TRANSLATION_DEFS, context.lang, id);
  };
  if (routeDef.dataSource) {
    const segments = [routeDef.dataSource];
    if (context.regionId) segments.push(context.regionId);
    segments.push(context.lang);
    try {
      local.data = await fetchJsonData(`json/${segments.join('-')}`, context.SOURCE_DATA_HOSTNAME);
    } catch (err) {
      debug(err);
    }
  }
  const renderView = () => {
    return VIEWS[viewName](local);
  };
  let content = '';
  ejs.renderFile(path.join(__dirname, '/views/site.ejs'), Object.assign({}, local, { renderView, message }), { rmWhitespace: false }, (err, str) => {
    if (err) {
      debug(err);
      content = 'OOPSIE';
    }
    content = str;
  });
  return content;
};

module.exports = {
  setConstants,
  getHref,
  assertValidRouting,
  assertValidRoute,
  renderPage,
};
