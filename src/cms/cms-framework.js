/* global document */

const appendButton = require('./lib/append-button');
const postSubmission = require('./lib/post-submission');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');

const editModal = require('./modals/framework.ejs');
const confirmModal = require('./modals/translate-confirm.ejs');

const LANG = document.querySelector('html').getAttribute('lang') || 'en';

const onModalSave = () => {
  const formContext = parseForm();
  console.log(formContext);
};

const editOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  postSubmission({ methodName: 'get', id })
    .then((rec) => {
      displayModal(editModal, { rec }, onModalSave);
    });
};

const translateOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  const fromLang = target.getAttribute('data-fromlang') || '';
  const toLang = target.getAttribute('data-tolang') || '';
  displayModal(confirmModal, { fromLang, toLang }, () => {
    const params = {
      propertyName: 'text',
      id,
      fromLang,
      toLang,
    };
    postSubmission(params)
      .then(() => {
        // closeModal();
        // location.reload(true);
      });
  });
};

/**
 * Inject the buttons
*/

Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .datum-editable.datum-framework') || []).forEach((ele) => {
  const id = ele.getAttribute('data-id');
  const langs = (ele.getAttribute('data-langs') || '').split(','); // this was passed as a serialized toString() array
  langs.forEach((lang) => {
    appendButton(ele, {
      text: lang.toUpperCase(),
      onClick: translateOnClick,
      data: {
        id,
        fromlang: lang,
        tolang: LANG,
        property: ele.getAttribute('data-property') || '',
      },
    });
  });
  appendButton(ele, {
    className: 'fas fa-sm fa-edit',
    onClick: editOnClick,
    data: {
      id,
      property: ele.getAttribute('data-property') || '',
    },
  });
});
