/* eslint-env shared-node-browser */
/* eslint no-console: 0, no-restricted-globals: 0 */

require('./cms-citation');
require('./cms-contact');
require('./cms-value');
require('./cms-array');
require('./cms-text');
require('./cms-framework');
require('./cms-partnership');

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

// const appendButton = (ele, props = {}) => {
//   const appendToSelector = props.selector || '.heading-datum';
//   const button = document.createElement('span');
//   button.className = 'button';
//   if (props.text) {
//     const span = document.createElement('span');
//     span.innerText = props.text;
//     button.appendChild(span);
//   } else {
//     const icon = document.createElement('i');
//     icon.className = props.className || '';
//     button.appendChild(icon);
//   }
//   if (props.data) {
//     Object.entries(props.data).forEach(([attrKey, attrVal]) => {
//       button.setAttribute(`data-${attrKey}`, attrVal);
//     });
//   }
//   if (props.onClick) button.addEventListener('click', props.onClick);
//   // else button.addEventListener('click', editButtonOnClick);
//   const heading = ele.querySelector(appendToSelector);
//   if (heading && heading.firstChild) heading.insertBefore(button, heading.firstChild);
//   else ele.appendChild(button);
// };
