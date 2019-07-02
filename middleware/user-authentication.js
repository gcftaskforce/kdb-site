'use strict';

const debug = require('debug')('site:middleware:userAuthentication');
const fs = require('fs-extra');

const express = require('express');

const router = express.Router();

module.exports = (routeName, pathToUsers) => {
  let USERS = [];
  try {
    USERS = fs.readJsonSync(pathToUsers, 'utf8');
  } catch (err) {
    debug('APP_WARNING: unable to read JSON USERS file--no users will have CMS access. The following exception was thrown');
    debug(err);
  }
  if (!Array.isArray(USERS)) {
    debug('APP_WARNING: JSON USERS file must be an arary of strings--no users will have CMS access.');
    USERS = [];
  }

  router.get(`/${routeName}/:accessKey?`, (req, res) => {
    const { accessKey } = req.params;
    const isAuthenticated = USERS.includes(accessKey);
    if (isAuthenticated) {
      req.session.user = (accessKey || '').split(':')[1] || 'anonymous';
    } else if (req.session) {
      req.session.destroy((err) => {
        if (err) debug(err);
      });
    }
    res.redirect('/en');
  });
  return router;
};

router.get('/logout*', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) debug(err);
    });
  }
  res.redirect('/en');
});
