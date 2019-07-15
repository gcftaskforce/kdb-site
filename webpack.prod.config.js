'use strict';

require('dotenv').config();
require('@babel/register');

const path = require('path');
const webpack = require('webpack');

// this references tha public API and would be useful for fetching data for interactive features (NOT CURRENTLY USED)
// const CLIENT_DATA_ENDPOINT = 'https://gcftaskforce-database.org/public/json/';

// this references the private API used by the CMS
const CLIENT_API_ENDPOINT = 'https://gcftaskforce-database.org/api';

module.exports = () => {
  const entry = path.resolve(__dirname, 'src', 'index.js');
  const filename = 'bundle.js';
  return {
    mode: 'production',
    entry,
    output: {
      path: path.resolve(__dirname, 'public'),
      filename,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.ejs$/,
          use: ['./ejs-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        // CLIENT_DATA_ENDPOINT: JSON.stringify(CLIENT_DATA_ENDPOINT),
        CLIENT_API_ENDPOINT: JSON.stringify(CLIENT_API_ENDPOINT),
      }),
    ],
  };
};
