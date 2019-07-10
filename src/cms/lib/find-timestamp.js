'use strict';

const SEPARATOR = '~';

module.exports = (timestampsArg, propertyNameArg, langArg) => {
  if (!Array.isArray(timestampsArg)) return '';
  if (!(propertyNameArg && langArg)) return '';
  const requestedTimestamp = timestampsArg.find((t) => {
    const [, propertyName, lang] = t.split(SEPARATOR);
    return ((propertyName === propertyNameArg) && (lang === langArg));
  });
  return requestedTimestamp || '';
};
