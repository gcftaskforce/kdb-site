'use strict';

class RegionNotFoundError extends Error {
  constructor(context = {}, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegionNotFoundError);
    }

    this.name = 'RegionNotFoundError';
    this.status = 404;
    this.context = context;
  }
}

module.exports = RegionNotFoundError;
