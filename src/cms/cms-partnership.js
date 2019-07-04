/* global document */

const appendButton = require('./lib/append-button');
const postToAPI = require('./lib/post-to-api');
const parseForm = require('./lib/parse-form');
const displayModal = require('./lib/display-modal');

const jurisdictionListModal = require('./modals/partnership-jurisdiction-list.ejs');
const deleteConfirmModal = require('./modals/partnership-delete-confirm.ejs');
const partnershipAddForm = require('./forms/partnership-add.ejs');

const LANG = document.querySelector('html').getAttribute('lang') || 'en';

// subheader contains the current region ID in a data attribute
const REGION_ID = (document.getElementById('subheader-regional'))
  ? document.getElementById('subheader-regional').getAttribute('data-regionid') || ''
  : '';

const onModalSaveJurisdictions = () => {
  const { data, submission } = parseForm();
  postToAPI('updateEntityProperty', { id: data.id }, submission)
    .then((responseData) => {
      console.log(responseData);
    });
};

/**
 * Inject buttons for editing member jurisdictions
*/

// Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .datum-editable.datum-partnership') || []).forEach((ele) => {
//   const id = target.getAttribute('data-id') || '';
//   // console.log(ele);
// });

/**
 * Inject buttons for deleting partnership
*/

const deleteOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  postToAPI('get', { id, lang: LANG })
    .then((rec) => {
      displayModal(deleteConfirmModal, { rec }, () => {
        // const submission = parseForm();
        // console.log(submission);
      });
    });
};

const jurisdictionEditOnClick = (evt) => {
  const target = evt.currentTarget;
  const id = target.getAttribute('data-id') || '';
  postToAPI('get', { id, lang: LANG })
    .then((rec) => {
      displayModal(jurisdictionListModal, { rec }, onModalSaveJurisdictions);
    });
};

Array.prototype.slice.call(document.querySelectorAll('.cms-enabled .partnership-container') || []).forEach((ele) => {
  const id = ele.getAttribute('id');
  // inject delete button
  appendButton(ele, {
    className: 'fas fa-sm fa-times-circle',
    selector: '.box-heading',
    onClick: deleteOnClick,
    data: {
      id,
    },
  });
  // inject jurisdiction-list edit button
  const jurisdictionListEle = ele.querySelector('.datum-partnership-jurisdictions');
  if (jurisdictionListEle) {
    appendButton(jurisdictionListEle, {
      className: 'fas fa-sm fa-edit',
      onClick: jurisdictionEditOnClick,
      data: { id },
    });
  }
});

/**
 * Inject form for adding partnership
*/

const partnershipsContainer = document.querySelector('.cms-enabled .partnerships');

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
    console.log(params, submission);
  };
  document.getElementById('partnership-add').addEventListener('click', addOnClick);
}
