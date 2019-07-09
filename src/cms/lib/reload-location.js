/* global window */

'use strict';

module.exports = (hash) => {
  if (hash) window.location.hash = hash;
  else window.location.hash = '';
  window.location.reload();
};
