'use strict';

module.exports = (definitions, lang, id, property = 'label') => {
  if (!Array.isArray(definitions)) return '';
  const definition = definitions.find(d => (d.id === id));
  if (definition === undefined) return '';
  if (definition[property] === undefined) return '';
  if (Array.isArray(definition[property])) {
    let translation = definition[property].find(d => (d[0] === lang));
    if (translation !== undefined) return translation[1] || '';
    // try English as fallback
    translation = definition[property].find(d => (d[0] === 'en'));
    if (translation !== undefined) return translation[1] || '';
    return '';
  }
  if (typeof definition[property] === 'string') return definition[property];
  return '';
};
