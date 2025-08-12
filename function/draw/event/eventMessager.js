const { searchInDrawioFile } = require('../parsing/searchInDrawioFile');
const { findConnectionChain } = require('../graph/findConnectionChain');
const { handleConnectionAction } = require('../actions/handleConnectionAction');
const { setVariable, setFlag } = require('../variables');
const { EditVariableValue } = require('../../state/EditVariable');

async function eventMesseger(event, bot) {
  try {
    setVariable('lastEvent', event, 'system');

    const scriptPath = bot?.flowcraft?.scriptPath || 'script.drawio';
    const diagramData = searchInDrawioFile(scriptPath, event);
    if (!diagramData) return;

    const actions = findConnectionChain(diagramData.parsedData, diagramData.sourceId);

    if (actions.length === 0) {
      return;
    }

    for (const action of actions) {
      if (typeof action === 'string') {
        if (action.startsWith('кд: ')) {
          const delay = parseInt(action.split('кд: ')[1], 10);
          if (!isNaN(delay)) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } else {
          await handleConnectionAction(bot, action);
        }
      } else if (action.type === 'loop') {
        const { varName, start, end, actions: loopActions } = action;
        EditVariableValue(bot, varName, start);
        for (let i = start; i <= end; i++) {
          EditVariableValue(bot, varName, i);
          for (const loopAction of loopActions) {
            if (typeof loopAction === 'string') {
              if (loopAction.startsWith('кд: ')) {
                const delay = parseInt(loopAction.split('кд: ')[1], 10);
                if (!isNaN(delay)) {
                  await new Promise(resolve => setTimeout(resolve, delay));
                }
              } else {
                await handleConnectionAction(bot, loopAction);
              }
            }
          }
        }
      } else if (action.type === 'repeat') {
        const { count, actions: repeatActions } = action;
        if (count === -1) {
          while (true) {
            for (const repeatAction of repeatActions) {
              if (typeof repeatAction === 'string') {
                if (repeatAction.startsWith('кд: ')) {
                  const delay = parseInt(repeatAction.split('кд: ')[1], 10);
                  if (!isNaN(delay)) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                  }
                } else {
                  await handleConnectionAction(bot, repeatAction);
                }
              }
            }
          }
        } else {
          for (let i = 0; i < count; i++) {
            for (const repeatAction of repeatActions) {
              if (typeof repeatAction === 'string') {
                if (repeatAction.startsWith('кд: ')) {
                  const delay = parseInt(repeatAction.split('кд: ')[1], 10);
                  if (!isNaN(delay)) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                  }
                } else {
                  await handleConnectionAction(bot, repeatAction);
                }
              }
            }
          }
        }
      } else if (typeof action === 'object' && action['Открыт инвентарь?']) {
        const isInventoryOpen = bot.currentWindow?.slots.length > 0;
        setFlag('inventoryOpen', isInventoryOpen);
        const actionsToExecute = isInventoryOpen ? action['Открыт инвентарь?']['ДА'] : action['Открыт инвентарь?']['НЕТ'];
        for (const subAction of actionsToExecute) {
          if (typeof subAction === 'string') {
            if (subAction.startsWith('кд: ')) {
              const delay = parseInt(subAction.split('кд: ')[1], 10);
              if (!isNaN(delay)) {
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            } else {
              await handleConnectionAction(bot, subAction);
            }
          } else if (typeof subAction === 'object' && subAction['Открыт инвентарь?']) {
            const isInventoryOpen = bot.currentWindow?.slots.length > 0;
            setFlag('inventoryOpen', isInventoryOpen);
            const nestedActionsToExecute = isInventoryOpen ? subAction['Открыт инвентарь?']['ДА'] : subAction['Открыт инвентарь?']['НЕТ'];
            for (const nestedAction of nestedActionsToExecute) {
              if (typeof nestedAction === 'string') {
                if (nestedAction.startsWith('кд: ')) {
                  const delay = parseInt(nestedAction.split('кд: ')[1], 10);
                  if (!isNaN(delay)) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                  }
                } else {
                  await handleConnectionAction(bot, nestedAction);
                }
              }
            }
          }
        }
      } else if (typeof action === 'object') {
        const conditionKey = Object.keys(action).find(k => k.startsWith('если:'));
        if (conditionKey) {
          const match = conditionKey.match(/^если:\s*(\w+)\s*==\s*(.+)$/);
          if (match) {
            const variable = match[1];
            const value = match[2];
            let currentValue = '';
            if (bot.variable && Array.isArray(bot.variable)) {
              const found = bot.variable.find(v => v[1] === variable);
              if (found) currentValue = found[2];
            }
            const isYes = currentValue == value;
            const actionsToExecute = isYes ? action[conditionKey]['ДА'] : action[conditionKey]['НЕТ'];
            for (const subAction of actionsToExecute) {
              if (typeof subAction === 'string') {
                if (subAction.startsWith('кд: ')) {
                  const delay = parseInt(subAction.split('кд: ')[1], 10);
                  if (!isNaN(delay)) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                  }
                } else {
                  await handleConnectionAction(bot, subAction);
                }
              } else if (typeof subAction === 'object') {
                actions.push(subAction);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in eventMesseger:', error);
  }
}

module.exports = { eventMesseger } 