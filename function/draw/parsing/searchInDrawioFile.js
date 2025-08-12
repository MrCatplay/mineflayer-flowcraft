const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
};

function parseDiagramFile(filename) {
  try {
    const xmlData = fs.readFileSync(filename, 'utf8');
    const parser = new XMLParser(parserOptions);
    return parser.parse(xmlData);
  } catch (error) {
    console.error('Ошибка чтения файла:', error.message);
    return null;
  }
}

function findElementByValue(obj, searchValue) {
  let result = null;
  const upperValue = searchValue.toUpperCase();

  function search(node) {
    if (node?.['@_value']?.toUpperCase()?.includes(upperValue)) {
      result = node;
      return;
    }
    if (node && typeof node === 'object') {
      for (const key in node) {
        if (typeof node[key] === 'object') {
          search(node[key]);
        }
      }
    }
  }

  search(obj);
  return result;
}

function searchInDrawioFile(filename, value) {
  try {
    const parsedData = parseDiagramFile(filename);
    if (!parsedData) return null;

    const startElement = findElementByValue(parsedData, value);
    if (!startElement) return null;

    return {
      parsedData,
      sourceId: startElement['@_id']
    };
  } catch (error) {
    console.error('Ошибка:', error.message);
    return null;
  }
}

function findCloudElements(obj) {
  const cloudElements = [];

  function search(node) {
    if (node?.['@_style']?.includes('shape=cloud')) {
      const value = node['@_value'] || '';
      const match = value.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const [, variableName, variableValue] = match;
        cloudElements.push([node['@_id'], variableName, variableValue]);
      } else {
        cloudElements.push([node['@_id'], value, '']);
      }
    }
    if (node && typeof node === 'object') {
      for (const key in node) {
        if (typeof node[key] === 'object') {
          search(node[key]);
        }
      }
    }
  }

  search(obj);
  return cloudElements;
}

function findCloudShapes(filename) {
  try {
    const parsedData = parseDiagramFile(filename);
    if (!parsedData) return [];
    return findCloudElements(parsedData);
  } catch (error) {
    console.error('Ошибка:', error.message);
    return [];
  }
}

module.exports = { searchInDrawioFile, parseDiagramFile, findCloudShapes, findCloudElements } 