/* global document */

const appendButton = require('./lib/append-button');
const postSubmission = require('./lib/post-submission');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');

const modal = require('./modals/citation.ejs');

const onModalSave = () => {
  const formContext = parseForm();
  console.log(formContext);
};

const onClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  postSubmission({ methodName: 'get', id })
    .then((rec) => {
      displayModal(modal, { rec }, onModalSave);
    });
};

/**
 * Inject the buttons
*/

Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .datum-editable.datum-cited') || []).forEach((ele) => {
  const id = ele.getAttribute('data-id');
  appendButton(ele, {
    className: 'fas fa-sm fa-asterisk',
    onClick,
    data: {
      id,
    },
  });
});
