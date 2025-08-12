const { cooldowns } = require('./store');

function setCooldown(name, duration) {
  cooldowns.set(name, Date.now() + duration);
}

module.exports = { setCooldown }; 