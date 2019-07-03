/* global document */
/* eslint-env shared-node-browser */
/* eslint no-console: 0, no-restricted-globals: 0 */

// id="summary-table" class=""

let PANEL_ELE;

const printDatum = (data, fieldLocator) => {
  const defaultString = '';
  if (!data[fieldLocator[0]]) return defaultString;
  const datum = data[fieldLocator[0]].find(d => (d.fieldName === fieldLocator[1]));
  if (!datum) return defaultString;
  if (!datum.string) return defaultString;
  return datum.string;
};

const createFooter = (footerCells = []) => {
  const tfoot = document.createElement('tfoot');
  const tr = tfoot.appendChild(document.createElement('tr'));
  tr.className = 'footer';
  footerCells.forEach((cell) => {
    const cellText = cell.text || '';
    const thEle = document.createElement('th');
    thEle.innerText = cellText;
    const innerDiv = document.createElement('div');
    innerDiv.innerText = cellText;
    thEle.appendChild(innerDiv);
    tr.appendChild(thEle);
  });
  return tfoot;
};

const createHeader = (headerCells = []) => {
  const thead = document.createElement('thead');
  const tr = thead.appendChild(document.createElement('tr'));
  tr.className = 'header';
  headerCells.forEach((cell) => {
    const cellText = cell.text || '';
    const thEle = document.createElement('th');
    thEle.innerText = cellText;
    const innerDiv = document.createElement('div');
    innerDiv.innerText = cellText;
    thEle.appendChild(innerDiv);
    tr.appendChild(thEle);
  });
  return thead;
};

const createBody = (bodyRows = []) => {
  const tbody = document.createElement('tbody');
  bodyRows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.innerText = cell.text || '';
      if (cell.className) td.className = cell.className;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  return tbody;
};

export default {
  instantiate(data, domId) {
    if (!data) return;
    if (!Array.isArray(data.nations)) return;
    const tableData = { header: [], footer: [], body: [] };
    tableData.header.push({ text: 'State/Province', className: 'cell-label' });
    tableData.header.push({ text: 'Country', className: 'cell-label' });

    tableData.header.push({ text: 'Forest Area', className: 'cell-amount forest-area' });
    tableData.header.push({ text: '% Global', className: 'cell-amount forest-area-percent' });

    tableData.header.push({ text: '', className: 'cell-spacer' });

    tableData.header.push({ text: 'Forest Carbon', className: 'cell-amount forest-carbon' });
    tableData.header.push({ text: '% Global', className: 'cell-amount forest-carbon-percent' });

    tableData.header.push({ text: '', className: 'cell-padding' });
    data.nations.forEach((nation) => {
      nation.jurisdictions.forEach((jurisdiction) => {
        const rowData = [];
        rowData.push({ text: jurisdiction.shortName });
        rowData.push({ text: nation.name });

        rowData.push({ text: printDatum(jurisdiction, ['values', 'forestArea']), className: 'cell-amount forest-area' });
        rowData.push({ text: printDatum(jurisdiction, ['values', 'forestAreaPercentOfGlobal']), className: 'cell-amount forest-area-percent' });

        rowData.push({ text: '', className: 'cell-spacer' });

        rowData.push({ text: printDatum(jurisdiction, ['values', 'forestCarbon']), className: 'cell-amount forest-carbon' });
        rowData.push({ text: printDatum(jurisdiction, ['values', 'carbonPercentOfGlobal']), className: 'cell-amount forest-carbon-percent' });

        rowData.push({ text: '', className: 'cell-padding' });
        tableData.body.push(rowData);
      });
    });
    tableData.footer.push({ text: 'Totals', className: 'cell-header' });
    tableData.footer.push({ text: '', className: 'cell-label' });

    tableData.footer.push({ text: `${printDatum(data, ['totals', 'forestArea'])} km²`, className: 'cell-amount' });
    tableData.footer.push({ text: `${printDatum(data, ['totals', 'forestAreaPercentOfGlobal'])} %`, className: 'cell-amount' });

    tableData.footer.push({ text: '', className: 'cell-spacer' });

    tableData.footer.push({ text: `${printDatum(data, ['totals', 'forestCarbon'])} M MtC`, className: 'cell-amount' });
    tableData.footer.push({ text: `${printDatum(data, ['totals', 'carbonPercentOfGlobal'])} %`, className: 'cell-amount' });

    tableData.footer.push({ text: '', className: 'cell-padding' });

    PANEL_ELE = document.getElementById(domId);
    if (!PANEL_ELE) return;
    const scrollableContainer = document.createElement('div');
    scrollableContainer.className = 'scrollable-container';
    // PANEL_ELE.appendChild(createFixedHeader());
    PANEL_ELE.appendChild(scrollableContainer);
    const table = document.createElement('table');
    table.className = 'table table-hover table-sm';
    scrollableContainer.appendChild(table);
    table.appendChild(createHeader(tableData.header));
    table.appendChild(createBody(tableData.body));
    table.appendChild(createFooter(tableData.footer));
  },
};
