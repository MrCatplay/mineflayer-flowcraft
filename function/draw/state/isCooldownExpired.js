const { cooldowns } = require('./store');

function isCooldownExpired(name) {
  return (cooldowns.get(name) || 0) < Date.now();
}

module.exports = { isCooldownExpired }; 