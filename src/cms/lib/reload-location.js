/* global window */

'use strict';

module.exports = (id) => {
  let href = window.location.origin;
  if (window.location.pathname) href += window.location.pathname;
  if (id) href += `?scrollTo=${id}`;
  window.location.replace(href);
};
