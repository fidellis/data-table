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

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _SelectCheckbox = require('./SelectCheckbox');

var _SelectCheckbox2 = _interopRequireDefault(_SelectCheckbox);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Label = function Label(_ref) {
  var children = _ref.children,
      onSort = _ref.onSort,
      column = _ref.column;

  var styles = {
    label: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 13,
      height: '100%',
      padding: 8
    }
  };

  var sorted = column.sorted;

  var sortable = column.sortable !== false;
  var sortIcon = onSort && sortable && sorted !== undefined ? sorted ? ' ↑' : ' ↓' : '';
  var onClick = sortable ? onSort : null;

  return _react2.default.createElement(
    'div',
    { style: styles.label, onClick: onClick },
    _react2.default.createElement(
      'span',
      { style: { textAlign: 'center', cursor: sortable ? 'pointer' : null } },
      children
    ),
    ' ',
    sortIcon
  );
};

var Input = function Input(_ref2) {
  var column = _ref2.column,
      rows = _ref2.rows,
      onSearch = _ref2.onSearch;

  var styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    inputContainer: {
      width: 'calc(100% - 10px)'
    },
    input: {
      marginTop: 2,
      marginBottom: 2,
      border: 1,
      borderColor: 'rgba(0, 0, 0, 0.14)',
      borderStyle: 'solid',
      borderRadius: 4,
      padding: 2,
      color: '#626466'
    }
  };

  var options = column.lookup ? (0, _uniq2.default)(rows.map(function (row) {
    return (0, _utils.cellRenderer)({ column: column, row: row });
  })).sort().map(function (value) {
    return { value: value, label: value };
  }) : [];

  return _react2.default.createElement(
    'div',
    { style: styles.container },
    column.lookup ? _react2.default.createElement(_SelectCheckbox2.default, {
      id: column.key,
      value: column.searchValue || [],
      onChange: function onChange(e) {
        return onSearch({ value: e.value, column: column });
      },
      options: options,
      style: styles.input,
      styleContainer: styles.inputContainer
    }) : _react2.default.createElement('input', {
      onChange: function onChange(e) {
        return onSearch({ value: e.target.value, column: column });
      },
      value: column.searchValue || '',
      style: _extends({}, styles.input, styles.inputContainer)
    })
  );
};

var Container = function Container(_ref3) {
  var children = _ref3.children,
      height = _ref3.height,
      headerStyle = _ref3.headerStyle;

  var styles = {
    container: {
      color: '#626466',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'stretch',
      borderRightStyle: 'solid',
      borderRightWidth: 1,
      borderWidth: [0, 1, 0, 0],
      borderColor: 'rgba(0,0,0,0.02)'
    }
  };
  return _react2.default.createElement(
    'div',
    { style: _extends({}, styles.container, headerStyle, { height: height }) },
    children
  );
};

var Cell = function Cell(_ref4) {
  var children = _ref4.children,
      column = _ref4.column,
      rows = _ref4.rows,
      height = _ref4.height,
      onSort = _ref4.onSort,
      onSearch = _ref4.onSearch;
  var search = column.search,
      headerStyle = column.headerStyle;

  return _react2.default.createElement(
    Container,
    { height: height, headerStyle: headerStyle },
    _react2.default.createElement(
      Label,
      { column: column, onSort: onSort },
      children
    ),
    search && _react2.default.createElement(Input, { column: column, rows: rows, onSearch: onSearch })
  );
};

var GroupCell = function GroupCell(_ref5) {
  var children = _ref5.children,
      column = _ref5.column,
      height = _ref5.height;
  var headerStyle = column.headerStyle;

  if (children) {
    headerStyle = _extends({}, headerStyle, {
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderRightStyle: 'solid',
      borderLeftStyle: 'solid',
      borderColor: '#d3d3d3'
    });
  }

  return _react2.default.createElement(
    Container,
    { height: height, headerStyle: headerStyle },
    _react2.default.createElement(
      Label,
      { column: column },
      children
    )
  );
};

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header(props) {
    _classCallCheck(this, Header);

    var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

    _this.onSort = _this.onSort.bind(_this);
    return _this;
  }

  _createClass(Header, [{
    key: 'onSort',
    value: function onSort(e) {
      e.preventDefault();
      if (this.props.onSort) {
        this.props.onSort(this.props.column);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          column = _props.column,
          rows = _props.rows,
          height = _props.height,
          onSearch = _props.onSearch,
          group = _props.group;


      return group ? _react2.default.createElement(
        GroupCell,
        {
          column: column,
          height: height
        },
        children
      ) : _react2.default.createElement(
        Cell,
        {
          column: column,
          rows: rows,
          height: height,
          onSort: this.onSort,
          onSearch: onSearch
        },
        children
      );
    }
  }]);

  return Header;
}(_react.Component);

Header.propTypes = {
  children: _propTypes2.default.node.isRequired,
  column: _propTypes2.default.object.isRequired,
  height: _propTypes2.default.number,
  onSort: _propTypes2.default.func,
  onSearch: _propTypes2.default.func
};

Header.defaultProps = {
  column: {},
  height: null,
  onSort: null,
  onSearch: null
};

exports.default = Header;