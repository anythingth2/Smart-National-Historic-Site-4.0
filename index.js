require('babel-register');
require("babel-polyfill");
require('dotenv').config()
if (process.argv.indexOf('--prod') !== -1) {
  process.env.NODE_ENV = 'prod'
}
require('./src/app')