/* global document */

const appendButton = require('./lib/append-button');
const appendIcon = require('./lib/append-icon');
const postToAPI = require('./lib/post-to-api');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');
const editModal = require('./modals/text.ejs');
const confirmModal = require('./modals/translate-confirm.ejs');
const reloadLocation = require('./lib/reload-location');
const findTimestamp = require('./lib/find-timestamp');
const formatTimestamp = require('./lib/format-timestamp');
const isGoogleTimestamp = require('./lib/is-google-timestamp');

const LANG = document.querySelector('html').getAttribute('lang') || 'en';
const SRC_LANGS = (document.querySelector('body').getAttribute('data-src-langs') || '').split(',');

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
  const propertyName = target.getAttribute('data-propertyname') || 'text';
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
  const propertyName = ele.getAttribute('data-propertyname') || 'text';
  const timestamps = (ele.getAttribute('data-timestamps') || '').split(',');
  const timestamp = findTimestamp(timestamps, propertyName, LANG);
  const isGoogleTranslation = isGoogleTimestamp(timestamp);
  // console.log(timestamps);
  SRC_LANGS.forEach((lang) => {
    appendButton(ele, {
      text: lang.toUpperCase(),
      title: `Replace with Google translation using ${lang.toLocaleUpperCase()} as the source`,
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
    title: formatTimestamp(timestamp),
    onClick: editOnClick,
    data: {
      id,
      propertyName,
      // lang: LANG,
    },
  });
  if (isGoogleTranslation) {
    appendIcon(ele, {
      className: 'fab fa-sm fa-google',
    });
  }
});
