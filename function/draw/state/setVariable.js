const { variables } = require('./store');

function setVariable(name, value, namespace = 'global') {
  const key = `${namespace}:${name}`;
  variables.set(key, value);
}

module.exports = { setVariable }; 