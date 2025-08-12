module.exports = {
  ...require('./state/setVariable'),
  ...require('./state/getVariable'),
  ...require('./state/setFlag'),
  ...require('./state/getFlag'),
  ...require('./state/setCooldown'),
  ...require('./state/isCooldownExpired'),
  ...require('./state/incrementCounter'),
  ...require('./state/getCounter'),
};