'use strict';

module.exports = (timestampArg) => {
  if (typeof timestampArg !== 'string') return false;
  if (timestampArg.length === 0) return false;
  return timestampArg.toLowerCase().includes('google');
};
