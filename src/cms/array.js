/* global CLIENT_API_ENDPOINT document */

const appendButton = require('./lib/append-button');
const API = require('./lib/API');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');
const reloadLocation = require('./lib/reload-location');
const formatTimestamp = require('./lib/format-timestamp');

const modal = require('./modals/array.ejs');

let api;

const onModalSave = () => {
  const { data, submission } = parseForm();
  api.post('updateEntity', { id: data.id }, submission)
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

    Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .datum-editable.datum-array') || []).forEach((ele) => {
      const id = ele.getAttribute('data-id');
      const timestamp = ele.getAttribute('data-timestamp') || '';
      appendButton(ele, {
        className: 'fas fa-sm fa-edit',
        title: formatTimestamp(timestamp),
        onClick,
        data: {
          id,
        },
      });
    });
  },
};
