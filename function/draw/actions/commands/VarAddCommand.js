const { BaseCommand } = require('./BaseCommand');
const { EditVariableValue } = require('../../../state/EditVariable');

function getVariableValue(bot, variableName) {
  if (!bot.variable || !Array.isArray(bot.variable)) return 0;
  const found = bot.variable.find(v => v[1] === variableName);
  return found ? parseFloat(found[2]) : 0;
}

class VarAddCommand extends BaseCommand {
  constructor() { super({ name: 'var_add' }); }

  match(t) { return t.includes(' ++ '); }

  parse(t) { const [name, value] = t.split(' ++ '); return { name, value: parseFloat(value) }; }
  
  async execute(bot, { name, value }) {
    const current = getVariableValue(bot, name) || 0;
    EditVariableValue(bot, name, current + value);
  }
}

module.exports = { VarAddCommand }; 