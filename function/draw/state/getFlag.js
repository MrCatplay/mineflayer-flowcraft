const { flags } = require('./store');

function getFlag(name) {
  return flags.get(name) || false;
}

module.exports = { getFlag }; 