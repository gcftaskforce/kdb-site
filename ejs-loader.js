
const utils = require('loader-utils');
const ejs = require('ejs');

module.exports = function loader(source) {
  const template = ejs.compile(source, { client: true });
  return 'module.exports = ' + template;
};
