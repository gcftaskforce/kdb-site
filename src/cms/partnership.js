/* global window document */

const appendButton = require('./lib/append-button');
const API = require('./lib/API');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');

const stringModal = require('./modals/string.ejs');
const jurisdictionListModal = require('./modals/partnership-jurisdiction-list.ejs');
const deleteConfirmModal = require('./modals/partnership-delete-confirm.ejs');
const partnershipAddForm = require('./forms/partnership-add.ejs');
const reloadLocation = require('./lib/reload-location');

let api;

const LANG = document.querySelector('html').getAttribute('lang') || 'en';

// subheader contains the current region ID in a data attribute
const REGION_ID = (document.getElementById('subheader-regional'))
  ? document.getElementById('subheader-regional').getAttribute('data-regionid') || ''
  : '';

const onModalSaveJurisdictions = () => {
  const { data, submission } = parseForm();
  api.post('updateEntityProperty', { id: data.id }, submission)
    .then((responseData) => {
      // console.log(responseData);
      reloadLocation();
    });
};

const onModalSaveString = (apiRouteName) => {
  const { data, submission } = parseForm();
  api.post(apiRouteName, { id: data.id, lang: LANG }, submission)
    .then((responseData) => {
      console.log(responseData);
    });
};

/**
 * Inject buttons for deleting partnership
*/

const deleteOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  api.post('get', { id, lang: LANG })
    .then((rec) => {
      displayModal(deleteConfirmModal, { rec }, () => {
        api.post('delete', { id })
          .then((responseData) => {
            reloadLocation();
          });
      });
    });
};

const jurisdictionEditOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  api.post('get', { id, lang: LANG })
    .then((rec) => {
      displayModal(jurisdictionListModal, { rec }, onModalSaveJurisdictions);
    });
};

const stringEditOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  const propertyName = target.getAttribute('data-propertyname') || '';
  const lang = target.getAttribute('data-lang') || '';
  const isTranslatable = Boolean(lang); // only translatable fields include a lang attribute

  const apiRouteName = (isTranslatable) ? 'updateTranslation' : 'updateEntityProperty';
  api.post('get', { id, lang: LANG })
    .then((rec) => {
      displayModal(stringModal, { rec, propertyName }, onModalSaveString.bind(null, apiRouteName));
    });
};

module.exports = {
  render: (apiEndpoint) => {
    api = new API(apiEndpoint);

    /**
     * Process each partnership on the page
    */

    Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .partnership-container') || []).forEach((containerEle) => {
      const id = containerEle.getAttribute('id');
      // inject delete button
      appendButton(containerEle, {
        className: 'fas fa-sm fa-times-circle',
        selector: '.box-heading',
        onClick: deleteOnClick,
        data: {
          id,
        },
      });

      /**
       * Inject buttons for editing strings
      */

      Array.prototype.slice.call(containerEle.querySelectorAll('.datum-string') || []).forEach((ele) => {
        const lang = ele.getAttribute('data-lang');
        const propertyName = ele.getAttribute('data-propertyname');
        appendButton(ele, {
          className: 'fas fa-sm fa-edit',
          onClick: stringEditOnClick,
          data: { id, lang, propertyName },
        });
      });

      /**
       * Inject button for editing member jurisdictions
      */

      const jurisdictionListEle = containerEle.querySelector('.datum-partnership-jurisdictions');
      if (jurisdictionListEle) {
        appendButton(jurisdictionListEle, {
          className: 'fas fa-sm fa-edit',
          onClick: jurisdictionEditOnClick,
          data: { id },
        });
      }
    });


    const partnershipsContainer = document.querySelector('.cms-enabled .partnerships');

    /**
     * Inject form for adding partnership
    */

    if (partnershipsContainer) {
      partnershipsContainer.insertAdjacentHTML('afterbegin', partnershipAddForm({ regionId: REGION_ID }));

      const addOnClick = () => {
        let name = '';
        const inputEle = document.getElementById('property-partnership-name');
        if (inputEle) name = inputEle.value || '';
        if (!name) return; // don't submit a blank name TODO: issue a warning
        const params = {
          modelName: 'partnership',
          methodName: 'insert',
          regionId: REGION_ID,
          lang: LANG,
        };
        const submission = { name };
        api.post('insert', params, submission)
          .then((responseData) => {
            reloadLocation(responseData.id);
          });
      };
      document.getElementById('partnership-add').addEventListener('click', addOnClick);

      /**
       * Check for "scroll"
      */

      if (window.location.search) {
        const params = {};
        window.location.search.substring(1).split('&').forEach((paramString) => {
          const [key, value] = paramString.split('=');
          params[key] = value;
        });
        if (params.scrollTo) {
          const ele = document.getElementById(params.scrollTo);
          if (ele) {
            ele.scrollIntoView();
            // clear the search params
            let href = window.location.origin;
            if (window.location.pathname) href += window.location.pathname;
            window.history.replaceState({ id: params.scrollTo }, '', href);
          }
        }
      }
    }
  },
};
