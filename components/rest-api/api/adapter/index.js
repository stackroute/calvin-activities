/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */

module.exports = {
  get circle() {
    return require('./circle');
  },
  get mailbox() {
    return require('./mailbox');
  },
  get activity() {
    return require('./activity');
  },
  get follow() {
    return require('./follow');
  },
  get route() {
    return require('./route');
  },
};
