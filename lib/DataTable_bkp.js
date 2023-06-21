'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fixedDataTable = require('fixed-data-table-2');

var _AutoSizer = require('react-virtualized/dist/commonjs/AutoSizer');

var _AutoSizer2 = _interopRequireDefault(_AutoSizer);

var _reactLoading = require('react-loading');

var _reactLoading2 = _interopRequireDefault(_reactLoading);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _utils = require('./utils');

require('./data-table.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function prepareColumn(_ref) {
  var columns = _ref.columns,
      column = _ref.column,
      key = _ref.key,
      props = _ref.props,
      tableWidth = _ref.tableWidth;

  return _extends({}, column, {
    key: key,
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
      column.columns = prepareColumns(_extends({ columns: column.columns }, props));
    } else {
      column = { columns: _defineProperty({}, key, prepareColumn(_extends({ columns: columns, column: column, key: key }, props))) };
    }

    cols[key] = prepareColumn(_extends({ columns: columns, column: column, key: key }, props));
  });
  return cols;
}

function getState(props) {
  var rows = props.rows;

  var hasGroup = Object.keys(props.columns).some(function (key) {
    return props.columns[key].columns;
  });
  var columns = (0, _clone2.default)(hasGroup ? prepareGroupColumns({ columns: props.columns, props: props }) : prepareColumns({ columns: props.columns, props: props }));

  return {
    columns: columns,
    // startColumns: columns,
    rows: rows,
    startRows: rows.slice(),
    config: {
      hasGroup: hasGroup
    }
  };
}

var Loading = function Loading() {
  return _react2.default.createElement(
    'div',
    { style: { marginTop: 20, display: 'flex', justifyContent: 'center' } },
    _react2.default.createElement(_reactLoading2.default, { type: 'spin', color: '#626466', height: 50, width: 50 })
  );
};

var DataTable = function (_Component) {
  _inherits(DataTable, _Component);

  function DataTable(props) {
    _classCallCheck(this, DataTable);

    var _this = _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this, props));

    var getRows = props.getRows;


    _this.state = getState(props);

    if (getRows) getRows(_this.state.rows);

    _this.onSearch = _this.onSearch.bind(_this);
    _this.onSort = _this.onSort.bind(_this);
    _this.renderGroup = _this.renderGroup.bind(_this);
    _this.renderColumn = _this.renderColumn.bind(_this);
    return _this;
  }

  _createClass(DataTable, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var rows = nextProps.rows,
          getRows = nextProps.getRows,
          columns = nextProps.columns;


      if (columns !== this.props.columns) {
        this.setState(getState(nextProps));
      }

      if (rows !== this.props.rows) {
        this.setState(getState(nextProps), function () {
          return getRows ? getRows(_this2.state.rows) : null;
        });
      }
    }
  }, {
    key: 'onSearch',
    value: function onSearch(_ref4) {
      var _this3 = this;

      var value = _ref4.value,
          column = _ref4.column;
      var getRows = this.props.getRows;
      var startRows = this.state.startRows;

      var columns = (0, _utils.getColumnsGroup)(this.state.columns);
      column.searchValue = value;
      var filteredColumns = Object.keys(columns).filter(function (key) {
        return columns[key].searchValue;
      }).map(function (key) {
        return columns[key];
      });

      var data = (0, _utils.filter)(startRows.slice(), filteredColumns);
      this.setState({ rows: data }, function () {
        return getRows ? getRows(_this3.state.rows) : null;
      });
    }
  }, {
    key: 'onSort',
    value: function onSort(column) {
      if (column.sortable === false) return;

      var _state = this.state,
          columns = _state.columns,
          rows = _state.rows;


      column.sorted = !column.sorted;
      Object.keys(columns).forEach(function (key) {
        if (columns[key] !== column) columns[key].sorted = undefined;
      });

      this.setState({ rows: (0, _utils.sort)(rows, column.key, column.sorted) });
    }
  }, {
    key: 'renderGroup',
    value: function renderGroup(_ref5) {
      var _this4 = this;

      var columns = _ref5.columns,
          label = _ref5.label,
          headerStyle = _ref5.headerStyle,
          props = _objectWithoutProperties(_ref5, ['columns', 'label', 'headerStyle']);

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
          return _this4.renderColumn(column);
        })
      );
    }
  }, {
    key: 'renderColumn',
    value: function renderColumn(column) {
      var _this5 = this;

      var rows = this.state.rows;
      var label = column.label,
          _footer = column.footer;


      return _react2.default.createElement(_fixedDataTable.Column, _extends({}, column, {
        header: _react2.default.createElement(
          _Header2.default,
          {
            column: column,
            onSearch: this.onSearch,
            onSort: this.onSort
          },
          label
        ),
        cell: function cell(_ref6) {
          var rowIndex = _ref6.rowIndex,
              cellProps = _objectWithoutProperties(_ref6, ['rowIndex']);

          return _react2.default.createElement(_Cell2.default, _extends({}, cellProps, {
            rowIndex: rowIndex,
            row: rows[rowIndex],
            column: column,
            onClick: _this5.props.onClick
          }));
        },
        footer: function footer(_ref7) {
          var columnKey = _ref7.columnKey;
          return _footer ? _react2.default.createElement(_Cell2.default, { column: _extends({}, column, { cellRenderer: null }), row: _defineProperty({}, columnKey, _footer({ columnKey: columnKey, rows: rows })) }) : null;
        }
      }));
    }
  }, {
    key: 'renderColumns',
    value: function renderColumns() {
      var _state2 = this.state,
          columns = _state2.columns,
          hasGroup = _state2.config.hasGroup;

      var render = hasGroup ? this.renderGroup : this.renderColumn;

      return Object.keys(columns).map(function (key) {
        return render(columns[key]);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height,
          maxHeight = _props.maxHeight,
          toolbar = _props.toolbar,
          loading = _props.loading;
      var contentHeight = this.state.contentHeight;


      return _react2.default.createElement(
        'div',
        { style: { width: width, marginLeft: 'auto', marginRight: 'auto' } },
        toolbar,
        _react2.default.createElement(
          'div',
          { style: { height: height || (contentHeight < maxHeight ? contentHeight : maxHeight) } },
          loading ? _react2.default.createElement(Loading, null) : _react2.default.createElement(
            _AutoSizer2.default,
            { key: 'table' },
            function (_ref9) {
              var width = _ref9.width;
              return _react2.default.createElement(
                _fixedDataTable.Table,
                _extends({}, _this6.props, {
                  width: width,
                  rowsCount: _this6.state.rows.length,
                  onContentHeightChange: function onContentHeightChange(h) {
                    return _this6.setState({ contentHeight: h });
                  }
                }),
                _this6.renderColumns()
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
  loading: _propTypes2.default.bool,
  getRows: _propTypes2.default.func
};

DataTable.defaultProps = {
  columns: {},
  rows: [],
  maxHeight: 850,
  headerHeight: 70,
  rowHeight: 40,
  groupHeaderHeight: 40,
  width: '100%',
  toolbar: null,
  loading: false,
  getRows: null,
  onClick: null
};

exports.default = DataTable;