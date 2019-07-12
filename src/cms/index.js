/* eslint-env shared-node-browser */
/* eslint no-console: 0, no-restricted-globals: 0 */

const citation = require('./citation');
const contact = require('./contact');
const value = require('./value');
const array = require('./array');
const text = require('./text');
const framework = require('./framework');
const partnership = require('./partnership');

module.exports = {
  render: (apiEndpoint) => {
    citation.render(apiEndpoint);
    contact.render(apiEndpoint);
    value.render(apiEndpoint);
    array.render(apiEndpoint);
    text.render(apiEndpoint);
    framework.render(apiEndpoint);
    partnership.render(apiEndpoint);
  },
};

// const cleanUp = () => {
//   $('.summernote-text').summernote('destroy');
//   $('.summernote-citation').summernote('destroy');
//   $('#modal').modal('dispose');
//   if (document.getElementById('modal')) document.getElementById('modal').remove();
// };

// const closeModal = () => {
//   $('#modal').modal('hide');
//   // cleanUp();
// };
