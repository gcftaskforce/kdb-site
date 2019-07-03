/* global fetch CLIENT_API_ENDPOINT */

'use strict';

const FETCH_OPTIONS = {
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
};

module.exports = (params, submission) => {
  let query = '';
  let methodName = 'update';
  if (params) {
    const querySlugs = [];
    Object.entries(params).forEach(([name, value]) => {
      if (!value) return;
      if (name === 'methodName') methodName = encodeURIComponent(value);
      else querySlugs.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
    });
    if (querySlugs.length) query = `?${querySlugs.join('&')}`;
  }
  const options = Object.assign({ headers: { 'Content-Type': 'application/json' } }, FETCH_OPTIONS);
  if (submission) options.body = JSON.stringify(submission);
  const uri = `${CLIENT_API_ENDPOINT}/${methodName}${query}`;
  return fetch(uri, options)
    .then((res) => {
      if (!res.ok) return {}; // TODO: PROCESS ERROR
      return res.json();
    });
};
