'use strict';

module.exports = (availableLangs = [], req, requestedLangArg = '') => {
  const requestedLang = (typeof requestedLangArg === 'string') ? requestedLangArg.toLowerCase() : '';
  // if requestedLang is a 2-character lang code, check if it's supported and use it if so
  if (requestedLang.length === 2 && availableLangs.includes(requestedLang)) return requestedLang;
  // check for 'lang' specification in query string
  if (req.query.lang && availableLangs.includes(req.query.lang)) return req.query.lang;
  // finally, check the 'accepts' header, falling back to 'en'
  return req.acceptsLanguages(availableLangs) || 'en';
};
