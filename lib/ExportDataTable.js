'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLoading = require('react-loading');

var _reactLoading2 = _interopRequireDefault(_reactLoading);

var _DataTable = require('./DataTable');

var _DataTable2 = _interopRequireDefault(_DataTable);

var _ToolBar = require('./ToolBar');

var _ToolBar2 = _interopRequireDefault(_ToolBar);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExportDataTable = function (_Component) {
  _inherits(ExportDataTable, _Component);

  function ExportDataTable(props) {
    _classCallCheck(this, ExportDataTable);

    var _this = _possibleConstructorReturn(this, (ExportDataTable.__proto__ || Object.getPrototypeOf(ExportDataTable)).call(this, props));

    _this.state = {
      exportedRows: props.rows
    };

    return _this;
  }

  _createClass(ExportDataTable, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          rows = _props.rows,
          columns = _props.columns,
          title = _props.title,
          actions = _props.actions,
          ExportComponet = _props.ExportComponet,
          _getRows = _props.getRows,
          props = _objectWithoutProperties(_props, ['rows', 'columns', 'title', 'actions', 'ExportComponet', 'getRows']);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_DataTable2.default, _extends({}, props, {
          rows: rows,
          columns: columns,
          getRows: function getRows(exportedRows) {
            return _this2.setState({ exportedRows: exportedRows }, function () {
              return _getRows(exportedRows);
            });
          },
          toolbar: _react2.default.createElement(_ToolBar2.default, {
            title: title,
            actions: [ExportComponet ? _react2.default.createElement(ExportComponet, { onClick: function onClick() {
                return (0, _utils.onExportCsv)({ rows: _this2.state.exportedRows, columns: columns });
              } }) : null].concat(actions) })
        }))
      );
    }
  }]);

  return ExportDataTable;
}(_react.Component);

;

ExportDataTable.propTypes = {
  columns: _propTypes2.default.object.isRequired,
  rows: _propTypes2.default.array.isRequired
};

ExportDataTable.defaultProps = {
  columns: {},
  rows: [],
  actions: [],
  getRows: function getRows() {}
};

exports.default = ExportDataTable;