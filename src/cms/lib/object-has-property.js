'use strict';

const objectHasProperty = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

module.exports = objectHasProperty;
