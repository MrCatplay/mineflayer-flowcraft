const { findElementById } = require('./findElementById');
const { findEdgeLabels } = require('./findEdgeLabels');

const DEBUG = process.env.DEBUG === 'true';

function findConnections(parsedData, idMap, sourceId) {
  const connections = [];

  // Try fast path: if we have prebuilt edgeBySource and labelByEdgeId on idMap
  const edgeBySource = idMap && idMap.edgeBySource ? idMap.edgeBySource : null;
  const labelByEdgeId = idMap && idMap.labelByEdgeId ? idMap.labelByEdgeId : null;

  if (edgeBySource && labelByEdgeId) {
    const edges = edgeBySource.get(sourceId) || [];
    for (const e of edges) {
      const target = findElementById(idMap.idMap || idMap, e.targetId);
      const edgeLabel = labelByEdgeId.get(e.edgeId) || null;
      connections.push({
        sourceId: e.sourceId,
        targetId: e.targetId,
        value: target?.['@_value'] || null,
        label: edgeLabel
      });
    }
    return connections;
  }

  // Fallback: scan parsedData
  function searchEdges(obj) {
    if (obj && typeof obj === 'object') {
      if (obj['@_edge'] === '1' && obj['@_source'] === sourceId) {
        if (DEBUG) console.log('Найдено ребро:', obj['@_id'], 'из', obj['@_source'], 'в', obj['@_target']);
        const target = findElementById(idMap, obj['@_target']);
        let edgeLabel = null;
        const edgeId = obj['@_id'];
        const parent = findElementById(idMap, '1');
        if (parent && parent.mxCell) {
          const cells = Array.isArray(parent.mxCell) ? parent.mxCell : [parent.mxCell];
          for (const cell of cells) {
            if (cell['@_parent'] === edgeId && cell['@_value']) {
              edgeLabel = cell['@_value'];
              break;
            }
          }
        }
        if (!edgeLabel) {
          const edgeLabels = findEdgeLabels(parsedData, idMap);
          for (const edge of edgeLabels) {
            if (edge.edgeId === edgeId) {
              edgeLabel = edge.label;
              break;
            }
          }
        }
        connections.push({
          sourceId: obj['@_source'],
          targetId: obj['@_target'],
          value: target?.['@_value'] || null,
          label: edgeLabel
        });
      }
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          searchEdges(obj[key]);
        }
      }
    }
  }
  searchEdges(parsedData);
  return connections;
}

module.exports = { findConnections } 