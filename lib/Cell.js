'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fixedDataTable = require('fixed-data-table-2');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var styles = exports.styles = {
  column: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    fontSize: 12,
    color: '#626466'
  }
};

function getAlign(type) {
  var t = (type || '').toUpperCase();
  if (['INTEGER', 'DECIMAL', 'NUMBER', 'PERCENT'].includes(t)) return 'right';
  if (['BOOLEAN', 'DATE', 'DATETIME', 'TIME'].includes(t)) return 'center';
  return 'left';
}

function getJustifyContent(align) {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
}

function getStyle(_ref) {
  var column = _ref.column,
      columnKey = _ref.columnKey,
      row = _ref.row,
      rowIndex = _ref.rowIndex,
      value = _ref.value,
      onClick = _ref.onClick;
  var type = column.type,
      styleRenderer = column.styleRenderer;

  var style = _extends({}, styles.column, column.style);
  if (styleRenderer) style = _extends({}, style, styleRenderer({ value: value, column: column, columnKey: columnKey, row: row, rowIndex: rowIndex }));
  if (onClick) style = _extends({}, style, { cursor: 'pointer' });

  var align = column.align || getAlign(type);
  style = _extends({}, style, { justifyContent: getJustifyContent(align) });

  return style;
}

var TableCell = function TableCell(_ref2) {
  var column = _ref2.column,
      row = _ref2.row,
      rows = _ref2.rows,
      props = _objectWithoutProperties(_ref2, ['column', 'row', 'rows']);

  var _onClick = column.onClick || props.onClick;
  var value = (0, _utils.cellRenderer)({ column: column, row: row, rows: rows });
  return _react2.default.createElement(
    _fixedDataTable.Cell,
    _extends({}, props, {
      style: getStyle(_extends({}, props, { column: column, row: row, value: value, onClick: _onClick })),
      onClick: function onClick() {
        return _onClick ? _onClick(_extends({ column: column, row: row }, props)) : null;
      },
      title: column.title
    }),
    value
  );
};

TableCell.propTypes = {
  row: _propTypes2.default.object.isRequired,
  column: _propTypes2.default.object.isRequired,
  onClick: _propTypes2.default.func
};

TableCell.defaultProps = {
  column: {},
  row: {},
  onClick: null
};

exports.default = TableCell;