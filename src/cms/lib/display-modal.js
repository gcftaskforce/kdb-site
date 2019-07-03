/* global $ document */

'use strict';

const SUMMERNOTE_TEXT_OPTIONS = {
  height: 250,
  minHeight: null,
  maxHeight: null,
  toolbar: [
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['strikethrough', 'superscript', 'subscript']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['insert', ['link']],
  ],
};

const SUMMERNOTE_CITATION_OPTIONS = {
  minHeight: null,
  maxHeight: null,
  toolbar: [
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['superscript', 'subscript']],
    ['insert', ['link']],
  ],
};

module.exports = (modal, context = {}, onSubmit) => {
  // clear any existing modals
  if (document.getElementById('modal')) document.getElementById('modal').remove();
  const body = document.querySelector('body');
  // inject modal into DOM
  if (modal === undefined) return; // there isn't a modal for this kind
  body.insertAdjacentHTML('beforeend', modal(context).trim());
  if (typeof onSubmit === 'function') {
    const submitButton = document.getElementById('modal-submit');
    if (submitButton) submitButton.addEventListener('click', onSubmit);
  }
  // instantiate the modal
  $('#modal').modal();
  // instantiate Summernote
  $('.summernote-text').summernote(SUMMERNOTE_TEXT_OPTIONS);
  $('.summernote-citation').summernote(SUMMERNOTE_CITATION_OPTIONS);
};
