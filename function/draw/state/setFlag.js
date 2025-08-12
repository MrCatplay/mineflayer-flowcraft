const { flags } = require('./store');

function setFlag(name, value) {
  flags.set(name, !!value);
}

module.exports = { setFlag }; 