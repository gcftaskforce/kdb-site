'use strict';

require('dotenv').config();
require('@babel/register');

const path = require('path');
const webpack = require('webpack');

// if (!process.env.SITE_VERSION) {
//   throw Error('Environment variable "SITE_VERSION" is required.');
// }

// if (!process.env.CMS_VERSION) {
//   throw Error('Environment variable "CMS_VERSION" is required.');
// }

const CLIENT_DATA_ENDPOINT = 'https://gcftaskforce-database.org/public/json/';
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
        CLIENT_DATA_ENDPOINT: JSON.stringify(CLIENT_DATA_ENDPOINT),
        CLIENT_API_ENDPOINT: JSON.stringify(CLIENT_API_ENDPOINT),
      }),
    ],
  };
};
