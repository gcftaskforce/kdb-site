'use strict';

class RouteNotFoundError extends Error {
  constructor(context = {}, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RouteNotFoundError);
    }

    this.name = 'RouteNotFoundError';
    this.status = 404;
    this.context = context;
  }
}

module.exports = RouteNotFoundError;
