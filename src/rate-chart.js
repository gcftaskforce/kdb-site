/* global $, Chart */
/* eslint-env shared-node-browser */
/* eslint no-console: 0, no-restricted-globals: 0 */

const GREEN_COLOR = 'rgba(60,179,113, 1)'; // #3CB371
const GREEN_COLOR_MUTED = 'rgba(230,250,230, 1)';
// const BLUE_COLOR = 'rgba(54, 162, 235, 1)';
const BLUE_COLOR = '#5d83b4';
const RED_COLOR = 'rgba(235, 162, 54, 1)';
const WHITE_COLOR = 'rgba(256, 256, 256, 1)';
const WHITE_TRANSPARENT_COLOR = 'rgba(256, 256, 256, .8)';
const GRAY_COLOR = 'rgba(105, 105, 105, 1)';
const Y_UNITS = 'km²';

const POINT_RADIUS = 5;

const parseJson = (srcString) => {
  const unescapedString = srcString.replace(/&quot;/g, '"');
  return JSON.parse(unescapedString);
};

const achievesGoal = (referenceRatesData, x, y) => {
  if (!Array.isArray(referenceRatesData)) return false;
  const referenceRateEntry = referenceRatesData.find(r => (r.x === x));
  if (referenceRateEntry) return (y <= referenceRateEntry.y);
  // interpolate
  const r1 = referenceRatesData[0];
  const r2 = referenceRatesData[referenceRatesData.length - 1];
  if (r2.x === r1.x) return false;
  const slope = (r2.y - r1.y) / (r2.x - r1.x);
  if (Number.isNaN(slope)) return false;
  return (y <= (r1.y + slope * (x - r1.x)));
};

export default {
  deforestationRates(ele) {
    const $ele = $(ele);
    const ctx = ele.getContext('2d');
    const referenceLabel = $ele.attr('data-referencelabel');
    const ratesCategoryLabel = $ele.attr('data-ratescategorylabel');
    let goalValue = Number.parseFloat($ele.attr('data-goalvalue'));
    const goalYear = $ele.attr('data-goalyear');
    let goalLabel = $ele.attr('data-goallabel');
    goalValue = (goalValue < 1) ? goalValue.toFixed(1) : goalValue.toFixed(0);

    let referenceStartYear = $ele.attr('data-referenceyear') || '';
    let referenceStartValue;
    const referenceRates = parseJson($ele.attr('data-referencerates'));
    const deforestationRates = parseJson($ele.attr('data-rates'));
    // Calculate refeference-rate data (steps)
    const referenceRatesData = [];
    referenceRates.forEach((rate) => {
      const [startYear, endYear] = String(rate.year).split('-').map(r => Number.parseInt(r.trim(), 10));
      const { amount } = rate;
      if (endYear) {
        for (let yearInt = startYear; yearInt <= endYear; yearInt += 1) {
          const year = String(yearInt);
          const referenceRateDatum = referenceRatesData.find(r => (r.year === year));
          if (referenceRateDatum) referenceRateDatum.y = amount;
          else referenceRatesData.push({ x: year, y: amount });
        }
      } else {
        const year = String(startYear);
        const referenceRateDatum = referenceRatesData.find(r => (r.year === year));
        if (referenceRateDatum) referenceRateDatum.y = amount;
        else referenceRatesData.push({ x: year, y: amount });
      }
    });
    // If custom reference start year wasn't specified, use the year from the first reference-rates-data array
    if (!referenceStartYear && referenceRatesData.length > 1) {
      referenceStartYear = referenceRatesData[0].x;
    }
    // Set the reference value, which is the one associated with the reference year
    if (referenceStartYear) {
      referenceRatesData.forEach((datum) => {
        if (datum.x <= referenceStartYear) referenceStartValue = datum.y;
      });
    }
    // Add datasets in layers
    let referenceRatesDataset = {};
    let interpolationLineDataset = {};
    let deforestationRatesDataset = {};
    // let achievedRatesDataset = {};
    let goalPointDataset = {};
    // Reference rate steps
    if (referenceRatesData.length) {
      referenceRatesDataset = {
        type: 'line',
        data: referenceRatesData,
        pointStyle: 'line',
        steppedLine: 'before',
        borderWidth: 1.8,
        pointRadius: 0,
        fill: false,
        borderColor: RED_COLOR,
        label: referenceLabel,
      };
    }
    if (referenceStartYear && goalYear && (referenceStartYear !== goalYear) && !Number.isNaN(referenceStartValue) && !Number.isNaN(goalValue)) {
      // Interpolation line
      interpolationLineDataset = {
        type: 'line',
        pointStyle: 'line',
        borderWidth: 1.5,
        borderDash: [5, 5],
        borderColor: GREEN_COLOR,
        backgroundColor: GREEN_COLOR_MUTED,
        pointHitRadius: 0,
        data: [
          { x: referenceStartYear, y: referenceStartValue },
          { x: goalYear, y: goalValue },
        ],
      };
      // rates that achieve the goal
      deforestationRates.forEach((rate) => {
        rate.achievesGoal = false;
        if (rate.year < referenceStartYear) return; // only check amounts at or beyond the reference year
        if (achievesGoal([{ x: referenceStartYear, y: referenceStartValue }, { x: goalYear, y: goalValue }], rate.year, rate.amount)) {
          rate.achievesGoal = true;
        }
      });
    }
    if (goalValue && goalYear) {
      const startLabel = deforestationRates[deforestationRates.length - 1].year;
      if (goalYear > startLabel) {
        const diff = goalYear - startLabel;
        for (let i = 1; i <= diff; i += 1) {
          deforestationRates.push({ year: String(startLabel * 1 + i), amount: null });
        }
      }
      // Goal point
      goalPointDataset = {
        type: 'scatter',
        pointStyle: 'star',
        radius: 9,
        hoverRadius: 9,
        pointHoverRadius: 9,
        borderWidth: 2,
        pointHoverBorderWidth: 2,
        borderColor: GREEN_COLOR,
        pointHitRadius: 0,
        data: [{ x: goalYear, y: goalValue }],
        label: goalLabel,
      };
    }
    // Deforestation rates
    const points = deforestationRates.map((rate) => {
      const point = rate.achievesGoal ? {
        pointBackgroundColor: GREEN_COLOR,
        pointBorderColor: GREEN_COLOR,
      } : {
        pointBackgroundColor: WHITE_COLOR,
        pointBorderColor: BLUE_COLOR,
      };
      return point;
    });
    deforestationRatesDataset = {
      fill: false,
      spanGaps: false,
      data: deforestationRates.map(r => r.amount),
      borderWidth: 1.5,
      pointRadius: POINT_RADIUS,
      pointHoverRadius: POINT_RADIUS,
      pointBackgroundColor: points.map(p => p.pointBackgroundColor),
      pointHoverBackgroundColor: points.map(p => p.pointBackgroundColor),
      pointBorderColor: points.map(p => p.pointBorderColor),
      pointBorderWidth: 2,
      pointHoverBorderWidth: 2,
      borderColor: BLUE_COLOR,
    };
    const props = {
      type: 'line',
      data: {
        labels: deforestationRates.map(r => r.year),
        datasets: [
          referenceRatesDataset,
          goalPointDataset,
          deforestationRatesDataset,
          interpolationLineDataset,
        ],
      },
      options: {
        tooltips: {
          displayColors: false,
          intersect: false, /* default: true */
          mode: 'nearest', /* nearest point index dataset */
          backgroundColor: WHITE_TRANSPARENT_COLOR,
          titleFontColor: GRAY_COLOR,
          bodyFontColor: GRAY_COLOR,
          borderColor: GRAY_COLOR,
          borderWidth: 1.3,
          // filter: (tooltipItem, data) => {
          //   const { index, datasetIndex } = tooltipItem;
          //   if ([1].includes(datasetIndex)) return false;
          //   // console.log('bar');
          //   return true;
          // },
          callbacks: {
            // labelColor: (tooltipItem) => {
            //   const { index, datasetIndex } = tooltipItem;
            //   if ([1].includes(datasetIndex)) return false;
            //   // const datum = data.datasets[datasetIndex].data[index];
            //   return { borderColor: 'rgba(60,179,113)', backgroundColor: 'rgba(60,179,113)' };
            // },
            // labelTextColor: (tooltipItem) => {
            //   return '#543453';
            // },
            title: (tooltipItems, data) => {
              if (!Array.isArray(tooltipItems) || !tooltipItems.length) return null;
              const { index, datasetIndex } = tooltipItems[0];
              if ([1].includes(datasetIndex)) return false;
              let title = '';
              if (datasetIndex === 0) {
                title = referenceLabel;
              } else if (datasetIndex === 3) {
                title = goalLabel;
              } else {
                title = data.labels[index];
              }
              return title;
            },
            label: (tooltipItem, data) => {
              const { index, datasetIndex } = tooltipItem;
              if ([1].includes(datasetIndex)) return false;
              const datum = data.datasets[datasetIndex].data[index];
              let label = '';
              if (datasetIndex === 0) {
                label = `${tooltipItem.yLabel} ${Y_UNITS}`;
              } else if (datasetIndex === 3) {
                label = `${datum.y} ${Y_UNITS} (${datum.x})`;
              } else {
                label = `${tooltipItem.yLabel} ${Y_UNITS}`;
              }
              return label;
            },
          },
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            filter: (legendItem) => {
              return Boolean(legendItem.text);
            },
          },
        },
        title: { display: false },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: ratesCategoryLabel,
            },
            ticks: {
              callback: (value) => { return `'${String(value).substr(2)}`; },
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: Y_UNITS,
            },
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
      },
    };
    Chart.defaults.global.defaultFontSize = 14;
    const chart = new Chart(ctx, props);
  },
};
