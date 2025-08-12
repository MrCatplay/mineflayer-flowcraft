const { counters } = require('./store');

function getCounter(name) {
  return counters.get(name) || 0;
}

module.exports = { getCounter }; 