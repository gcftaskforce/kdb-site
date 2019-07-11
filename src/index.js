
/* global CLIENT_DATA_ENDPOINT, window, document */
/* eslint-env shared-node-browser */
/* eslint no-console: 0, no-restricted-globals: 0 */

import rateChart from './rate-chart';
import './cms/index';

window.onload = () => {
  // build deforestation-rate chart(s)
  const rateChartElements = document.querySelectorAll('.deforestationRateChart');
  if (rateChartElements.length) {
    Array.prototype.slice.call(rateChartElements).forEach((ele) => {
      rateChart.deforestationRates(ele);
    });
  }
  if (window.location.search) {
    const params = {};
    window.location.search.substring(1).split('&').forEach((item) =>{
      const [key, value] = item.split('=');
      if (key && value) params[key] = value;
    });
    // console.log(params);
    if (!params.scrollTo) return;
    const ele = document.getElementById(params.scrollTo);
    if (!ele) return;
    ele.scrollIntoView();
  }
};
