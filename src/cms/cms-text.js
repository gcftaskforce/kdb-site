/* global document */

const appendButton = require('./lib/append-button');
const postToAPI = require('./lib/post-to-api');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');
const editModal = require('./modals/text.ejs');
const confirmModal = require('./modals/translate-confirm.ejs');
const reloadLocation = require('./lib/reload-location');

const LANG = document.querySelector('html').getAttribute('lang') || 'en';

const onModalSave = () => {
  const { data, submission } = parseForm();
  const params = {
    id: data.id,
    lang: LANG,
  };
  postToAPI('updateTranslation', params, submission)
    .then((responseData) => {
      // console.log(responseData);
      reloadLocation();
    });
};

const editOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  const propertyName = target.getAttribute('data-propertyname') || '';
  postToAPI('get', { id, lang: LANG })
    .then((rec) => {
      displayModal(editModal, { rec, propertyName }, onModalSave);
    });
};

const translateOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  const fromLang = target.getAttribute('data-fromlang') || '';
  const toLang = target.getAttribute('data-tolang') || '';
  const propertyName = target.getAttribute('data-propertyname') || '';
  displayModal(confirmModal, { fromLang, toLang }, () => {
    const params = {
      propertyName,
      id,
      fromLang,
      toLang,
    };
    postToAPI(params)
      .then(() => {
        // closeModal();
        // location.reload(true);
      });
  });
};

/**
 * Inject the buttons
*/

Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .datum-editable.datum-text') || []).forEach((ele) => {
  const id = ele.getAttribute('data-id');
  const langs = (ele.getAttribute('data-langs') || '').split(','); // this was passed as a serialized toString() array
  const propertyName = ele.getAttribute('data-propertyname') || '';
  langs.forEach((lang) => {
    appendButton(ele, {
      text: lang.toUpperCase(),
      onClick: translateOnClick,
      data: {
        id,
        fromlang: lang,
        tolang: LANG,
        propertyName,
      },
    });
  });
  appendButton(ele, {
    className: 'fas fa-sm fa-edit',
    onClick: editOnClick,
    data: {
      id,
      propertyName,
      lang: LANG,
    },
  });
});
