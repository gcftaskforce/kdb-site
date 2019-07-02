require('dotenv').config();
const debug = require('debug')('site:test');
const fetch = require('node-fetch');

const { BASE_URI } = process.env;
// const REGION_ID = 'brazil.acre';
const LANG = 'pt';

describe('home page works', () => {
  let response;
  test('doesn\'t 404', () => {
    return fetch(`${BASE_URI}/${LANG}`)
      .then((res) => { response = res; return res; });
  });

  test('responds with OK', () => {
    expect(response.ok).toBe(true);
    if (!response.ok) return;
    response.text()
      .then((text) => {
        expect(text.length).not.toBe(0);
        // debug(text);
      });
  });
});
