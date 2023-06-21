import moment from 'moment';
import get from 'lodash/get';

export function formatInteger(valor) {
  return parseInt(valor || 0, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDecimal(n, toFixed) {
  return n ? parseFloat(n).toFixed(toFixed || toFixed === 0 ? toFixed : 2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.') : n;
}

export function formatDate(date, mask) {
  return moment(moment(date)._i.toString().slice(0, 10)).format(mask || 'DD/MM/YYYY');
}

export function formatDateTime(date) {
  // return moment(date).add('hour', 3).format('DD/MM/YYYY HH:mm');
  return moment(date).format('DD/MM/YYYY HH:mm');
}

export function formatCurrency(value, decimals) {
  const parsedValue = parseFloat(value);
  const BILHAO = 1000000000;
  const MILHAO = 1000000;
  const MIL = 1000;

  if (Math.abs(parsedValue) >= BILHAO) { return `${formatDecimal(parsedValue / BILHAO, decimals || 2)} bi`; }
  if (Math.abs(parsedValue) >= MILHAO) { return `${formatDecimal(parsedValue / MILHAO, decimals || 2)} mi`; }
  if (Math.abs(parsedValue) >= MIL) { return `${formatDecimal(parsedValue / MIL, decimals || 0)} mil`; }
  return formatDecimal(value);
}


export function removeSymbols(input) {
  let output = input;

  const map = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  };


  for (const c in map) {
    const regex = map[c];
    output = output.replace(regex, c);
  }

  return output;
}

export function format(data, { type, toFixed }) {
  if (typeof data === 'object') return data;

  type = (type || '').toUpperCase();

  if (type === 'DECIMAL') {
    return formatDecimal(data, toFixed);
  } else if (type === 'INTEGER' && data) {
    return formatInteger(data);
  } else if (data && type === 'DATE') {
    return formatDate(data);
  } else if (data && type === 'DATETIME') {
    return formatDateTime(data);
  } else if (data && type === 'TIME') {
    return moment(data, 'HH:mm:ss').format('HH:mm');
  } else if (type === 'PERCENT') {
    return `${formatDecimal(data)} %`;
  } else if (type === 'BOOLEAN') {
    return data === true ? 'Sim' : data === false ? 'Não' : '';
  }

  return data || '';
}

export function cellRenderer({ column, row, rows }) {
  const { key } = column;
  const value = column.cellRenderer ? column.cellRenderer({ row, column, rows }) : get(row, key);
  return format(value, column);
}

export const filter = (initialRows, filteredColumns) => {
  const rows = initialRows;

  return rows.filter(row => filteredColumns.every((column) => {
    const value = get(row, column.key);
    const formatValue = (column.cellRenderer ? column.cellRenderer({ row }) : format(value, column)) || '';

    if (Array.isArray(column.searchValue)) {
      if (!column.searchValue.length) return true;
      return column.searchValue.some(searchValue => {
        return searchValue.toString() === formatValue.toString();
      })
    } else {
      const regex = new RegExp(removeSymbols(column.searchValue.toString()), 'ig');
      return regex.test(removeSymbols(formatValue.toString()));
    }
  }));
};

export function sort(array, column) {
  const direction = column.sorted;
  const key = column.key;
  // const ajuste = direction ? 1 : -1;
  // const superior = 1 * ajuste;
  // const inferior = -1 * ajuste;

  // array.sort((a, b) => {
  //   let valueA = get(a, key);
  //   let valueB = get(b, key);

  //   if ((Number(valueA) || valueA == 0) && (Number(valueB) || valueB == 0)) {
  //     if (Number(valueA) || valueA == 0) {
  //       valueA = Number(valueA);
  //     }
  //     if (Number(valueB) || valueB == 0) {
  //       valueB = Number(valueB);
  //     }
  //   };

  //   if ((valueA === null || valueA === '') && (valueB || valueB == 0)) return inferior;
  //   if ((valueB === null || valueB === '') && (valueA || valueA == 0)) return superior;


  //   return valueA > valueB ? superior : inferior;
  // });

  // return array;
  const ajuste = direction ? 1 : -1;
  const superior = 1 * ajuste;
  const inferior = -1 * ajuste;


  array.sort((a, b) => {
    let valueA = column.cellRenderer ? column.cellRenderer({ row: a }) : get(a, key);
    let valueB = column.cellRenderer ? column.cellRenderer({ row: b }) : get(b, key);

    function isNull(v) {
      return [null, undefined, ''].includes(v);
    };

    if (isNull(valueA) && valueB) return inferior;
    if (isNull(valueB) && valueA) return superior;
    if (isNull(valueA) && isNull(valueB)) return superior;

    if (Number(valueA)) {
      valueA = Number(valueA);
      valueB = Number(valueB);
    }

    return valueA > valueB ? superior : inferior;
  });

  return array;
}

export function getColumnsGroup(c) {
  const columns = {};
  Object.keys(c).forEach((key) => {
    const column = c[key];
    if (column.columns) {
      Object.keys(column.columns).forEach((key) => {
        const group = column.columns[key];
        columns[key] = group;
      });
    } else {
      columns[key] = column;
    }
  });
  return columns;
}

export function exportCsv(data, filename = 'data-csv') {
  if (!data.length) {
    alert('Sem informações para exportação');
  } else {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    const keys = Object.keys(data[0]).filter(k => k);
    csvContent += `${keys.join(';')};\r\n`;
    data.forEach((d) => {
      csvContent += `${keys
        .map((k) => {
          const v = d[k];
          if (v === null || v === undefined) return '';
          return v.toString().replace(/;/g, ' ').replace(/[\n\r]+/g, '');
        })
        .join(';')};\r\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    link.innerHTML = ' ';
    document.body.appendChild(link); // Required for FF
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    });
  }
}

export function onExportCsv({ rows, columns }, callback) {
  const csvData = rows.map((row) => {
    const cData = {};

    Object.keys(columns).forEach((key) => {
      const column = { ...columns[key], key };
      const { label, csvRenderer, type } = column;

      function getValue(col) {
        let value = null;
        if (col.csvRenderer) {
          value = col.csvRenderer({ column: col, row, key });
        } else {
          value = cellRenderer({ column: col, row });
          if (typeof value === 'object') {
            value = format(get(row, col.key), col);
          }
          // if (!Number(value)) {
          //   value = value;
          // }
          if (typeof value === 'string') {
            value = value.trim().replace(/\#/g, '');
          }
        }
        return value;
      }
      if (column.columns) {
        Object.keys(column.columns).forEach((key) => {
          const c = { ...column.columns[key], key };
          if (c.label) {
            cData[`${label} - ${c.label}`] = getValue(c);
          }
        });
      } else if (label) {
        cData[column.label] = getValue(column);
      }
    });
    return cData;
  });
  exportCsv(csvData);
  if (callback) callback();
}

