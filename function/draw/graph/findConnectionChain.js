const { buildIdIndex } = require('./buildIdIndex');
const { findElementById } = require('./findElementById');
const { findConnections } = require('./findConnections');
const { buildGraphIndex } = require('./buildGraphIndex');

function findConnectionChain(parsedData, startId) {
  // Build composite index for faster lookups
  const graphIndex = buildGraphIndex(parsedData);
  const idMap = graphIndex; // pass composite to downstream

  const visited = new Set();
  const actions = [];
  const loopStack = [];

  function followConnections(sourceId) {
    if (visited.has(sourceId)) return;
    visited.add(sourceId);
    const element = findElementById(idMap.idMap || idMap, sourceId);
    if (!element) return;

    if (element['@_value'] && element['@_value'].startsWith('повторить:')) {
      const loopMatch = element['@_value'].match(/^повторить:\s*(бесконечно|\d+)$/);
      if (loopMatch) {
        const [, count] = loopMatch;
        const loopInfo = { count: count === 'бесконечно' ? -1 : parseInt(count), actions: [] };
        loopStack.push(loopInfo);

        const connections = findConnections(parsedData, idMap, element['@_id']);
        for (const connection of connections) {
          if (!connection.label) {
            followConnections(connection.targetId);
          }
        }

        actions.push({ type: 'repeat', ...loopInfo });
        loopStack.pop();
        return;
      }
    }

    const rawValue = (element['@_value'] || '').trim();
    const lowerValue = rawValue.toLowerCase();
    if (rawValue && (lowerValue.startsWith('если:') || lowerValue === 'открыт инвентарь?')) {
      const conditionKey = rawValue; // keep original text as key
      const conditionCheck = { [conditionKey]: { 'ДА': [], 'НЕТ': [] } };
      const connections = findConnections(parsedData, idMap, element['@_id']);
      for (const connection of connections) {
        const branchNode = findElementById(idMap.idMap || idMap, connection.targetId);
        if (!branchNode) continue;
        const branchRaw = (branchNode['@_value'] || '').trim();
        const branch = branchRaw.toUpperCase();
        if (branch === 'ДА' || branch === 'НЕТ') {
          const branchActions = [];
          const branchVisited = new Set();
          const branchConnections = findConnections(parsedData, idMap, branchNode['@_id']);
          for (const branchConnection of branchConnections) {
            followBranchActions(branchConnection.targetId, branchActions, branchVisited);
          }
          conditionCheck[conditionKey][branch] = branchActions;
        }
      }
      actions.push(conditionCheck);
      return;
    } else {
      const action = element['@_value'];
      if (loopStack.length > 0) {
        loopStack[loopStack.length - 1].actions.push(action);
      } else {
        actions.push(action);
      }
      const connections = findConnections(parsedData, idMap, element['@_id']);
      for (const connection of connections) {
        if (!connection.label) {
          followConnections(connection.targetId);
        }
      }
    }
  }

  function followBranchActions(sourceId, branchActions, branchVisited) {
    if (branchVisited.has(sourceId)) return;
    branchVisited.add(sourceId);
    const element = findElementById(idMap.idMap || idMap, sourceId);
    if (!element || !element['@_value']) return;

    const rawValue = (element['@_value'] || '').trim();
    const lowerValue = rawValue.toLowerCase();
    if (rawValue && (lowerValue.startsWith('если:') || lowerValue === 'открыт инвентарь?')) {
      const conditionKey = rawValue; // keep original text as key
      const conditionCheck = { [conditionKey]: { 'ДА': [], 'НЕТ': [] } };
      const connections = findConnections(parsedData, idMap, element['@_id']);
      for (const connection of connections) {
        const branchNode = findElementById(idMap.idMap || idMap, connection.targetId);
        if (!branchNode) continue;
        const branchRaw = (branchNode['@_value'] || '').trim();
        const branch = branchRaw.toUpperCase();
        if (branch === 'ДА' || branch === 'НЕТ') {
          const branchSubActions = [];
          const branchSubVisited = new Set();
          const branchConnections = findConnections(parsedData, idMap, branchNode['@_id']);
          for (const branchConnection of branchConnections) {
            followBranchActions(branchConnection.targetId, branchSubActions, branchSubVisited);
          }
          conditionCheck[conditionKey][branch] = branchSubActions;
        }
      }
      branchActions.push(conditionCheck);
      return;
    }

    branchActions.push(element['@_value']);
    const connections = findConnections(parsedData, idMap, element['@_id']);
    for (const connection of connections) {
      followBranchActions(connection.targetId, branchActions, branchVisited);
    }
  }

  followConnections(startId);
  return actions;
}

module.exports = { findConnectionChain } 