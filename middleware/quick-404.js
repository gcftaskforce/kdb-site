'use strict';

const express = require('express');

const router = express.Router();

module.exports = (routesThat404 = []) => {
  router.get(routesThat404, (req, res) => {
    res.status(404).send('');
  });
  return router;
};
