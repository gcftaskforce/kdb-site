'use strict';

module.exports = (timestampArg) => {
  if (typeof timestampArg !== 'string') return '';
  if (timestampArg.length === 0) return '';
  return `${timestampArg.substring(0, 10)}  ${timestampArg.substring(11, 16)}`;
};
