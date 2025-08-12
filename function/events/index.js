
const { death } = require('./death');
const { end } = require('./end');
const { Window } = require('./Window');
const { spawn } = require('./spawn');

function registerFlowDefaults(bot) {
  spawn(bot);
  death(bot);
  end(bot);
  Window(bot);
}

module.exports = { registerFlowDefaults }; 