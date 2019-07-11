/* global window */

'use strict';

module.exports = (id) => {
  if (!id) {
    window.location.reload();
    return;
  }
  let href = window.location.origin;
  if (window.location.pathname) href += window.location.pathname;
  href += `?scrollTo=${id}`;
  window.location.replace(href); // assign() / replace()
};
