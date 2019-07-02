'use strict';

const debug = require('debug')('site:libs:fetch-json-data');
const fetch = require('node-fetch');

const DEFAULT_HOSTNAME = process.env.SOURCE_DATA_HOSTNAME;

module.exports = (fileFullPath, hostname) => {
  const extension = fileFullPath.endsWith('.json') ? '' : '.json';
  const url = new URL(`${fileFullPath}${extension}`, hostname || DEFAULT_HOSTNAME);
  return fetch(url.href)
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    });
};
