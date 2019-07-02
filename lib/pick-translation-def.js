'use strict';

const FALLBACK = undefined;

const pickTranslationString = (translations, lang) => {
  if (Array.isArray(translations)) {
    let translation = translations.find(d => (d[0] === lang));
    if (translation !== undefined) return translation[1] || '';
    // try English as fallback
    translation = translations.find(d => (d[0] === 'en'));
    if (translation !== undefined) return translation[1] || '';
    return '';
  }
  if (typeof translations === 'string') return translations;
  return '';
};

module.exports = (definitions, lang, id) => {
  if (!Array.isArray(definitions)) return FALLBACK;
  const definition = definitions.find(d => (d.id === id));
  if (definition === undefined) return FALLBACK;
  const def = {};
  Object.entries(definition).forEach(([key, translations]) => {
    def[key] = pickTranslationString(translations, lang);
  });
  return def;
};
