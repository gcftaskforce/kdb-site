/* global document */

const appendButton = require('./lib/append-button');
const API = require('./lib/API');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');
const reloadLocation = require('./lib/reload-location');

const modal = require('./modals/citation.ejs');

let api;

const onModalSave = () => {
  const { data, submission } = parseForm();
  api.post('updateCitation', { id: data.id }, submission)
    .then((responseData) => {
      // console.log(responseData);
      reloadLocation();
    });
};

const onClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  api.post('get', { id })
    .then((rec) => {
      displayModal(modal, { rec }, onModalSave);
    });
};

module.exports = {
  render: (apiEndpoint) => {
    api = new API(apiEndpoint);

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
  },
};
