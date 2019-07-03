/* global document */

const appendButton = require('./lib/append-button');
const postToAPI = require('./lib/post-to-api');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');

const modal = require('./modals/citation.ejs');

const onModalSave = () => {
  const { data, submission } = parseForm();
  postToAPI('updateCitation', { id: data.id }, submission)
    .then((responseData) => {
      console.log(responseData);
    });
};

const onClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  postToAPI('get' { id })
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
