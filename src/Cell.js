import React from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'fixed-data-table-2';
import { cellRenderer } from './utils';

export const styles = {
  column: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    fontSize: 12,
    color: '#626466',
  },
};

function getAlign(type) {
  const t = (type || '').toUpperCase();
  if (['INTEGER', 'DECIMAL', 'NUMBER', 'PERCENT'].includes(t)) return 'right';
  if (['BOOLEAN', 'DATE', 'DATETIME', 'TIME'].includes(t)) return 'center';
  return 'left';
}

function getJustifyContent(align) {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
}

function getStyle({ column, columnKey, row, rowIndex, value, onClick }) {
  const { type, styleRenderer } = column;
  let style = { ...styles.column, ...column.style };
  if (styleRenderer) style = { ...style, ...styleRenderer({ value, column, columnKey, row, rowIndex }) };
  if (onClick) style = { ...style, cursor: 'pointer' };

  const align = column.align || getAlign(type);
  style = { ...style, justifyContent: getJustifyContent(align) };

  return style;
}

const TableCell = ({ column, row, rows, ...props }) => {
  const onClick = column.onClick || props.onClick;
  const value = cellRenderer({ column, row, rows });
  return (
    <Cell
      {...props}
      style={getStyle({ ...props, column, row, value, onClick })}
      onClick={() => (onClick ? onClick({ column, row, ...props }) : null)}
      title={column.title}
    >
      {value}
    </Cell>
  );
};

TableCell.propTypes = {
  row: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

TableCell.defaultProps = {
  column: {},
  row: {},
  onClick: null,
};

export default TableCell;
