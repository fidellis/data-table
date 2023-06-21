'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLoading = require('react-loading');

var _reactLoading2 = _interopRequireDefault(_reactLoading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  loading: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center'
  }
};

var Loading = function Loading() {
  return _react2.default.createElement(
    'div',
    { style: styles.loading },
    _react2.default.createElement(_reactLoading2.default, { type: 'spin', color: '#626466', height: 50, width: 50 })
  );
};

var Container = function Container(props) {
  var children = props.children,
      width = props.width,
      height = props.height,
      style = props.style,
      loading = props.loading;

  return _react2.default.createElement(
    'div',
    { style: _extends({}, style, { height: height }) },
    loading ? _react2.default.createElement(Loading, null) : _react2.default.createElement(
      'div',
      null,
      children
    )
  );
};

Container.defaultProps = {
  width: '100%',
  loading: false
};

exports.default = Container;