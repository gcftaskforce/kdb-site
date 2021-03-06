/* global CLIENT_API_ENDPOINT, window, document */
/* eslint-env shared-node-browser */
/* eslint no-console: 0, no-restricted-globals: 0 */

import rateChart from './kdb-rate-chart';

const cms = require('./kdb-site-cms');

// the variable 'CLIENT_API_ENDPOINT' must be available to the application (via Webpack plugin)

window.onload = () => {
  cms.render(CLIENT_API_ENDPOINT);
  // build deforestation-rate chart(s)
  const rateChartElements = document.querySelectorAll('.deforestationRateChart');
  if (rateChartElements.length) {
    Array.prototype.slice.call(rateChartElements).forEach((ele) => {
      rateChart.deforestationRates(ele);
    });
  }
};
