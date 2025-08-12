const { BaseCommand } = require('./BaseCommand');
const { EditVariableValue } = require('../../../state/EditVariable');

class VarSetCommand extends BaseCommand {
  constructor() { super({ name: 'var_set' }); }

  match(t) { return t.includes(' = '); }

  parse(t) { const [name, value] = t.split(' = '); return { name, value }; }
  
  async execute(bot, { name, value }) {
    if (name && value !== undefined) EditVariableValue(bot, name, value);
  }
}

module.exports = { VarSetCommand }; 