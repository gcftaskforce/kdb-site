/* global $ document */

'use strict';

module.exports = (ele, props = {}) => {
  const appendToSelector = props.selector || '.heading-datum';
  const button = document.createElement('span');
  button.className = 'button';
  if (props.text) {
    const span = document.createElement('span');
    span.innerText = props.text;
    button.appendChild(span);
  } else {
    const icon = document.createElement('i');
    icon.className = props.className || '';
    button.appendChild(icon);
  }
  if (props.title) {
    button.setAttribute('title', props.title);
    button.setAttribute('data-toggle', 'tooltip');
    $(button).tooltip();
  }
  if (props.data) {
    Object.entries(props.data).forEach(([attrKey, attrVal]) => {
      button.setAttribute(`data-${attrKey}`, attrVal);
    });
  }
  if (props.onClick) button.addEventListener('click', props.onClick);
  const heading = ele.querySelector(appendToSelector);
  if (heading && heading.firstChild) heading.insertBefore(button, heading.firstChild);
  else ele.appendChild(button);
};
