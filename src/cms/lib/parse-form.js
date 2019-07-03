/* global $ document */

const objectHasProperty = require('./object-has-property');

module.exports = () => {
  const context = { data: {}, submission: {} };
  const form = document.querySelector('form.submission');
  if (!form) return context;
  // copy data attributes to context.data
  if (form.hasAttributes()) {
    const attrs = form.attributes;
    for (let i = attrs.length - 1; i >= 0; i -= 1) {
      if (attrs[i].name.startsWith('data-')) context.data[attrs[i].name.substring(5)] = attrs[i].value;
    }
  }
  Array.prototype.slice.call(document.getElementsByClassName('entity-property')).forEach((ele) => {
    const propertyName = ele.getAttribute('data-property');
    if (!propertyName) return;
    if (!objectHasProperty(context.submission, propertyName)) context.submission[propertyName] = {};
    const rowId = ele.getAttribute('data-row-id');
    const item = ele.getAttribute('data-item');
    if (rowId) {
      // this is an array
      if (!Array.isArray(context.submission[propertyName])) context.submission[propertyName] = [];
      context.submission[propertyName].push({ id: rowId, string: ele.value });
      return;
    }
    if (item) {
      // this is a "list" (built by checkboxes)
      if (!Array.isArray(context.submission[propertyName])) context.submission[propertyName] = [];
      if (ele.checked) context.submission[propertyName].push(ele.value);
      return;
    }
    // this is a primitive
    context.submission[propertyName] = ele.value;
  });
  // read Summernote instances to get rich text (HTML)
  Array.prototype.slice.call(document.getElementsByClassName('summernote')).forEach((ele) => {
    const idSegments = (ele.getAttribute('id') || '').split('.');
    if (idSegments.length < 2) return;
    if (idSegments[0] !== 'summernote') return;
    context.submission[idSegments[1]] = $(ele).summernote('code');
  });
  return context;
};
