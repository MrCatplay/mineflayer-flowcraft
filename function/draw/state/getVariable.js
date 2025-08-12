const { variables } = require('./store');

function getVariable(name, namespace = 'global') {
  const key = `${namespace}:${name}`;
  return variables.get(key);
}

module.exports = { getVariable }; 