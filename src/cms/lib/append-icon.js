/* global $ document */

'use strict';

module.exports = (ele, props = {}) => {
  const appendToSelector = props.selector || '.heading-datum';
  const icon = document.createElement('i');
  icon.className = props.className || '';
  const heading = ele.querySelector(appendToSelector);
  if (heading && heading.firstChild) heading.insertBefore(icon, heading.firstChild);
  else ele.appendChild(icon);
};
