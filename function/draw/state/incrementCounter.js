const { counters } = require('./store');

function incrementCounter(name, amount = 1) {
  const current = counters.get(name) || 0;
  counters.set(name, current + amount);
}

module.exports = { incrementCounter }; 