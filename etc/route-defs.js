'use strict';

module.exports = [{
  routeName: '',
  viewName: 'home',
  dataSource: 'summary-data',
  labels: {
    en: 'Overview',
    es: 'Visión de conjunto',
    fr: 'Aperçu',
    id: 'Ikhtisar',
    pt: 'Visão geral',
  },
}, {
  routeName: 'NationalOverview',
  viewName: 'national-overview',
  dataSource: 'data',
  namespace: 'national',
  labels: {
    en: 'Overview',
    es: 'Visión de conjunto',
    fr: 'Aperçu',
    id: 'Ikhtisar',
    pt: 'Visão geral',
  },
}, {
  routeName: 'StateOverview',
  viewName: 'jurisdictional-overview',
  dataSource: 'data',
  namespace: 'jurisdictional',
  labels: {
    en: 'Overview',
    es: 'Visión de conjunto',
    fr: 'Aperçu',
    id: 'Ikhtisar',
    pt: 'Visão geral',
  },
}, {
  routeName: 'ForestMonitoring',
  viewName: 'jurisdictional-forest-monitoring',
  dataSource: 'data',
  namespace: 'jurisdictional',
  labels: {
    en: 'Forest Monitoring',
    es: 'Monitoreo forestal',
    fr: 'Surveillance des forêts',
    id: 'Pemantauan Hutan',
    pt: 'Monitoramento Florestal',
  },
}, {
  routeName: 'Frameworks',
  viewName: 'frameworks',
  dataSource: 'framework',
  namespace: 'regional', /* "regional" namespace allows for either "national" or "jurisdictional" */
  labels: {
    en: 'Frameworks',
    es: 'Marcos',
    fr: 'Cadres',
    id: 'Kerangka',
    pt: 'Marcos',
  },
}, {
  routeName: 'Partnerships',
  viewName: 'partnerships',
  dataSource: 'partnership',
  namespace: 'regional', /* "regional" namespace allows for either "national" or "jurisdictional" */
  labels: {
    en: 'Partnerships',
    es: 'Asociaciones',
    fr: 'Partenariats',
    id: 'Kemitraan',
    pt: 'Parcerias',
  },
}];
