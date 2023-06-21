'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import ReactLoading from 'react-loading';


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fixedDataTable = require('fixed-data-table-2');

var _AutoSizer = require('react-virtualized/dist/commonjs/AutoSizer');

var _AutoSizer2 = _interopRequireDefault(_AutoSizer);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _awesomeDebouncePromise = require('awesome-debounce-promise');

var _awesomeDebouncePromise2 = _interopRequireDefault(_awesomeDebouncePromise);

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _utils = require('./utils');

require('./data-table.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var MAX_HEIGHT = 690;

function prepareColumn(_ref) {
  var columns = _ref.columns,
      column = _ref.column,
      key = _ref.key,
      props = _ref.props,
      tableWidth = _ref.tableWidth,
      parentKey = _ref.parentKey;

  return _extends({}, column, {
    key: key,
    parentKey: parentKey,
    columnKey: key,
    type: column.type || 'STRING',
    width: column.width || (tableWidth ? tableWidth / Object.keys(columns).length : 100),
    flexGrow: !column.width ? 1 : null,
    headerStyle: _extends({}, props.headerStyle, column.headerStyle),
    style: _extends({}, props.style, column.style)
  });
}

function prepareColumns(_ref2) {
  var columns = _ref2.columns,
      props = _objectWithoutProperties(_ref2, ['columns']);

  var cols = {};

  Object.keys(columns).filter(function (key) {
    return columns[key].hide !== true;
  }).forEach(function (key) {
    var column = columns[key];
    cols[key] = prepareColumn(_extends({ columns: columns, column: column, key: key }, props));
  });

  return cols;
}

function prepareGroupColumns(_ref3) {
  var columns = _ref3.columns,
      props = _objectWithoutProperties(_ref3, ['columns']);

  var cols = {};
  Object.keys(columns).filter(function (key) {
    return columns[key].hide !== true;
  }).forEach(function (key) {
    var column = columns[key];

    if (column.columns) {
      column.columns = prepareColumns(_extends({ columns: column.columns, parentKey: key }, props));
    } else {
      column = { columns: _defineProperty({}, key, prepareColumn(_extends({ columns: columns, column: column, key: key, parentKey: key }, props))) };
    }

    cols[key] = prepareColumn(_extends({ columns: columns, column: column, key: key }, props));
  });
  return cols;
}

// const Loading = () => <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}><ReactLoading type="spin" color="#626466" height={50} width={50} /></div>;
var screenHeight = window.screen.height - 200;

var DataTable = function (_Component) {
  _inherits(DataTable, _Component);

  function DataTable(props) {
    _classCallCheck(this, DataTable);

    var _this = _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this, props));

    var rows = props.rows,
        columns = props.columns,
        getRows = props.getRows;


    _this.startRows = rows.slice();
    // this.columns = this.getColumns(props);
    _this.state = {
      // rows: this.getRows(),
      columns: _this.getColumns(props)
    };

    _this.state.rows = _this.getRows();

    if (getRows) getRows(_this.state.rows);

    _this.onSearch = _this.onSearch.bind(_this);
    _this.onSort = _this.onSort.bind(_this);
    _this.renderGroup = _this.renderGroup.bind(_this);
    _this.renderColumn = _this.renderColumn.bind(_this);
    _this.setColumn = _this.setColumn.bind(_this);
    _this.debounce = _this.debounce.bind(_this);
    return _this;
  }

  _createClass(DataTable, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var rows = nextProps.rows,
          columns = nextProps.columns,
          getRows = nextProps.getRows;

      if (rows !== this.props.rows) {
        this.startRows = rows.slice();
        this.setState({ rows: this.getRows(), columns: this.getColumns(nextProps) }, function () {
          return getRows ? getRows(_this2.state.rows) : null;
        });
      }

      if (columns !== this.props.columns) {
        this.setState({ columns: this.getColumns(nextProps) });
      }
    }
  }, {
    key: 'getColumns',
    value: function getColumns(props) {
      this.hasGroup = Object.keys(props.columns).some(function (key) {
        return props.columns[key].columns;
      });
      var columns = (0, _clone2.default)(this.hasGroup ? prepareGroupColumns({ columns: props.columns, props: props }) : prepareColumns({ columns: props.columns, props: props }));
      return columns;
    }
  }, {
    key: 'getFilteredColumns',
    value: function getFilteredColumns() {
      var columns = (0, _utils.getColumnsGroup)(this.state.columns);
      var filteredColumns = Object.keys(columns).filter(function (key) {
        return columns[key].searchValue;
      }).map(function (key) {
        return columns[key];
      });
      return filteredColumns;
    }
  }, {
    key: 'getFilteredRows',
    value: function getFilteredRows() {
      var filteredColumns = this.getFilteredColumns();
      return (0, _utils.filter)(this.startRows.slice(), filteredColumns);
    }
  }, {
    key: 'getRows',
    value: function getRows() {
      return this.getFilteredRows();
    }
  }, {
    key: 'debounce',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this3 = this;

        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awesomeDebouncePromise2.default)(function () {
                  return _this3.getRows();
                }, 500)();

              case 2:
                result = _context.sent;
                return _context.abrupt('return', result);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function debounce() {
        return _ref4.apply(this, arguments);
      }

      return debounce;
    }()
  }, {
    key: 'setColumn',
    value: function setColumn(params) {
      var _this4 = this;

      var key = params.column.key;
      var parentKey = params.column.parentKey;
      var columns = this.getColumns(this.props);
      var column = this.hasGroup ? columns[parentKey].columns[key] : columns[key];
      column.searchValue = params.value;
      if (this.hasGroup) {
        columns[parentKey].columns[key] = column;
      } else {
        columns[key] = column;
      }
      this.setState({ columns: columns }, function () {
        _this4.onSearch();
      });
    }
  }, {
    key: 'onSearch',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this5 = this;

        var _props, getRows, getColumns, rows;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _props = this.props, getRows = _props.getRows, getColumns = _props.getColumns;
                _context2.next = 3;
                return this.debounce();

              case 3:
                rows = _context2.sent;

                this.setState({ rows: rows }, function () {
                  if (getRows) getRows(_this5.state.rows);
                  if (getColumns) getColumns(_this5.state.columns);
                });

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function onSearch() {
        return _ref5.apply(this, arguments);
      }

      return onSearch;
    }()
  }, {
    key: 'onSort',
    value: function onSort(column) {
      if (column.sortable === false) return;
      var state = this.state;
      var rows = state.rows,
          columns = state.columns;


      column.sorted = !column.sorted;
      Object.keys(columns).forEach(function (key) {
        if (columns[key] !== column) columns[key].sorted = undefined;
      });

      this.setState({ rows: (0, _utils.sort)(rows, column) });
    }
  }, {
    key: 'renderGroup',
    value: function renderGroup(_ref6) {
      var _this6 = this;

      var columns = _ref6.columns,
          label = _ref6.label,
          headerStyle = _ref6.headerStyle,
          props = _objectWithoutProperties(_ref6, ['columns', 'label', 'headerStyle']);

      return _react2.default.createElement(
        _fixedDataTable.ColumnGroup,
        _extends({}, props, {
          header: _react2.default.createElement(
            _Header2.default,
            { column: { headerStyle: headerStyle }, group: true },
            label
          )
        }),
        Object.keys(columns).map(function (key) {
          var column = columns[key];
          return _this6.renderColumn(column);
        })
      );
    }
  }, {
    key: 'renderColumn',
    value: function renderColumn(column) {
      var _this7 = this;

      var rows = this.state.rows;
      var label = column.label,
          _footer = column.footer;


      return _react2.default.createElement(_fixedDataTable.Column, _extends({}, column, {
        header: _react2.default.createElement(
          _Header2.default,
          {
            column: column,
            rows: this.startRows,
            onSearch: this.setColumn,
            onSort: this.onSort
          },
          label
        ),
        cell: function cell(_ref7) {
          var rowIndex = _ref7.rowIndex,
              cellProps = _objectWithoutProperties(_ref7, ['rowIndex']);

          return _react2.default.createElement(_Cell2.default, _extends({}, cellProps, {
            rowIndex: rowIndex,
            row: rows[rowIndex],
            rows: rows,
            column: column,
            onClick: _this7.props.onClick
          }));
        },
        footer: function footer(_ref8) {
          var columnKey = _ref8.columnKey;
          return _footer ? _react2.default.createElement(_Cell2.default, { columnKey: columnKey, column: _extends({}, column, { cellRenderer: null }), row: _defineProperty({}, columnKey, _footer({ columnKey: columnKey, rows: rows })) }) : null;
        }
      }));
    }
  }, {
    key: 'renderColumns',
    value: function renderColumns() {
      var columns = this.state.columns;

      var render = this.hasGroup ? this.renderGroup : this.renderColumn;
      return Object.keys(columns).map(function (key) {
        return render(columns[key]);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var _props2 = this.props,
          height = _props2.height,
          fullWidth = _props2.fullWidth,
          toolbar = _props2.toolbar,
          props = _objectWithoutProperties(_props2, ['height', 'fullWidth', 'toolbar']);

      var contentHeight = this.state.contentHeight;

      if (fullWidth) {
        props.height = height;
      } else {
        props.maxHeight = height;
      }
      return _react2.default.createElement(
        'div',
        { style: { width: props.width, marginLeft: 'auto', marginRight: 'auto' } },
        toolbar,
        _react2.default.createElement(
          'div',
          { style: { height: contentHeight > height ? height : contentHeight } },
          _react2.default.createElement(
            _AutoSizer2.default,
            { key: 'table' },
            function (_ref10) {
              var width = _ref10.width;
              return _react2.default.createElement(
                _fixedDataTable.Table,
                _extends({}, props, {
                  width: width,
                  rowsCount: _this8.state.rows.length,
                  onContentHeightChange: function onContentHeightChange(h) {
                    return _this8.setState({ contentHeight: h });
                  }
                }),
                _this8.renderColumns()
              );
            }
          )
        )
      );
    }
  }]);

  return DataTable;
}(_react.Component);

DataTable.propTypes = {
  columns: _propTypes2.default.object.isRequired,
  rows: _propTypes2.default.array.isRequired,
  onClick: _propTypes2.default.func,
  maxHeight: _propTypes2.default.number,
  height: _propTypes2.default.number,
  width: _propTypes2.default.string,
  toolbar: _propTypes2.default.node,
  getRows: _propTypes2.default.func
};

DataTable.defaultProps = {
  columns: {},
  rows: [],
  height: screenHeight > MAX_HEIGHT ? MAX_HEIGHT : screenHeight,
  fullWidth: false,
  headerHeight: 70,
  rowHeight: 40,
  groupHeaderHeight: 40,
  width: '100%',
  toolbar: null,
  getRows: null,
  onClick: null,
  footerHeight: 0
};

exports.default = DataTable;