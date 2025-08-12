function EditVariableValue(bot, Variable, VariableValue) {
  if (!bot.variable) bot.variable = [];
  const existingIndex = bot.variable.findIndex(v => v[1] === Variable);
  if (existingIndex !== -1) {
    bot.variable[existingIndex][2] = VariableValue;
  } else {
    bot.variable.push([Date.now().toString(), Variable, VariableValue]);
  }
}

module.exports = { EditVariableValue } 