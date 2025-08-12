const { buildIdIndex } = require('./buildIdIndex');
const { findElementById } = require('./findElementById');

function buildGraphIndex(parsedData) {
  const idMap = buildIdIndex(parsedData);

  // Precompute edge labels from parent=1 mxCell cells
  const parent = findElementById(idMap, '1');
  const cells = parent && parent.mxCell ? (Array.isArray(parent.mxCell) ? parent.mxCell : [parent.mxCell]) : [];
  const labelByEdgeId = new Map();
  for (const cell of cells) {
    const parentId = cell['@_parent'];
    const value = cell['@_value'];
    if (parentId && value !== undefined) {
      labelByEdgeId.set(parentId, value);
    }
  }

  // Collect edges grouped by source
  const edgeBySource = new Map();
  const visited = new Set();
  const MAX_DEPTH = 2000;

  function walk(node, depth = 0) {
    if (!node || typeof node !== 'object' || depth > MAX_DEPTH) return;
    if (visited.has(node)) return;
    visited.add(node);

    if (node['@_edge'] === '1') {
      const edgeId = node['@_id'];
      const sourceId = node['@_source'];
      const targetId = node['@_target'];
      if (sourceId && targetId) {
        const arr = edgeBySource.get(sourceId) || [];
        arr.push({ edgeId, sourceId, targetId });
        edgeBySource.set(sourceId, arr);
      }
    }

    for (const key in node) {
      if (typeof node[key] === 'object') walk(node[key], depth + 1);
    }
  }

  walk(parsedData, 0);

  return {
    idMap,
    edgeBySource,
    labelByEdgeId,
  };
}

module.exports = { buildGraphIndex }; 