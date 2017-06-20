/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */

const config = require('../config');

console.log(process.env.DAO);
module.exports = {
  get circle() {
    return require(`./${config.dao}/circle`);
  },
  get mailbox() {
    return require(`./${config.dao}/mailbox`);
  },
  get activity() {
    return require(`./${config.dao}/activity`);
  },
};
