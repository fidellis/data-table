'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./select-check-box.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function convertOptions(_ref) {
	var options = _ref.options,
	    optionValue = _ref.optionValue,
	    optionLabel = _ref.optionLabel,
	    labelRenderer = _ref.labelRenderer;

	return options.map(function (option) {
		return { value: option[optionValue], label: labelRenderer ? labelRenderer(option) : option[optionLabel] };
	}).slice();
}

var InputSelect = function (_Component) {
	_inherits(InputSelect, _Component);

	function InputSelect(props) {
		_classCallCheck(this, InputSelect);

		var _this = _possibleConstructorReturn(this, (InputSelect.__proto__ || Object.getPrototypeOf(InputSelect)).call(this, props));

		var value = props.value,
		    optionValue = props.optionValue,
		    optionLabel = props.optionLabel,
		    labelRenderer = props.labelRenderer;

		var values = value;
		var options = convertOptions({ options: props.options, optionValue: optionValue, optionLabel: optionLabel, labelRenderer: labelRenderer });

		_this.state = {
			values: values,
			options: options,
			selectedOptions: _this.getSelected({ options: options, values: values })
			//initialOptions: options,

		};

		document.addEventListener('click', function (e) {
			var target = e.target;
			var evtClassName = target ? target.className : null;
			// const path = event.path || (event.composedPath && event.composedPath());
			var checkboxes = document.getElementsByClassName("checkboxes");

			for (var i = 0; i < checkboxes.length; i++) {
				var checkboxe = checkboxes[i];
				if (!evtClassName.includes(checkboxe.id)) {
					checkboxe.style.display = "none";
				}
			}
		}, true);

		_this.showCheckboxes = _this.showCheckboxes.bind(_this);
		return _this;
	}

	_createClass(InputSelect, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(_ref2) {
			var value = _ref2.value,
			    options = _ref2.options,
			    optionValue = _ref2.optionValue,
			    optionLabel = _ref2.optionLabel,
			    labelRenderer = _ref2.labelRenderer;

			if (options !== this.props.options) {
				this.setState({
					options: convertOptions({ options: options, optionValue: optionValue, optionLabel: optionLabel, labelRenderer: labelRenderer }),
					selectedOptions: this.getSelected({ values: value, options: options })
				});
			}
			if (value !== this.props.value) {
				this.setState({
					values: value,
					selectedOptions: this.getSelected({ values: value, options: options })
				});
			}
		}
	}, {
		key: 'onChange',
		value: function onChange(_ref3) {
			var _this2 = this;

			var checked = _ref3.checked,
			    value = _ref3.value,
			    selectedOption = _ref3.selectedOption;
			var _props = this.props,
			    onChange = _props.onChange,
			    id = _props.id;
			var options = this.state.options;

			var values = this.state.values.slice();
			if (checked) {
				values.push(value);
			} else {
				var indexSelected = values.indexOf(value);
				values.splice(indexSelected, 1);
			}
			var selectedOptions = this.getSelected({ values: values, options: options });
			this.setState({ values: values, selectedOptions: selectedOptions }, function () {
				_this2.props.onChange({ id: id, value: values, selectedValue: value, selectedOption: selectedOption, selectedOptions: selectedOptions });
			});
		}
	}, {
		key: 'getSelected',
		value: function getSelected(_ref4) {
			var options = _ref4.options,
			    values = _ref4.values;

			return options.filter(function (o) {
				return values.includes(o.value);
			});
		}
	}, {
		key: 'isSelected',
		value: function isSelected(option) {
			return this.state.values.some(function (v) {
				return JSON.stringify(v) === JSON.stringify(option.value);
			});
		}
	}, {
		key: 'renderSelectedLabel',
		value: function renderSelectedLabel() {
			return this.state.selectedOptions.map(function (o) {
				return o.label;
			}).join(', ');
		}
	}, {
		key: 'showCheckboxes',
		value: function showCheckboxes(id) {
			var checkboxes = document.getElementById('checkboxes-' + id);
			checkboxes.style.display = ["none", ""].includes(checkboxes.style.display) ? "block" : "none";
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _props2 = this.props,
			    id = _props2.id,
			    label = _props2.label,
			    placeholder = _props2.placeholder,
			    optionValue = _props2.optionValue,
			    optionLabel = _props2.optionLabel,
			    labelRenderer = _props2.labelRenderer,
			    width = _props2.width,
			    style = _props2.style,
			    styleContainer = _props2.styleContainer,
			    inputProps = _objectWithoutProperties(_props2, ['id', 'label', 'placeholder', 'optionValue', 'optionLabel', 'labelRenderer', 'width', 'style', 'styleContainer']);

			var options = this.state.options;


			return _react2.default.createElement(
				'div',
				{ id: 'multiselect-' + id, className: 'multiselect', style: styleContainer },
				_react2.default.createElement(
					'div',
					{ id: 'selectBox-' + id, className: 'selectBox', onClick: function onClick() {
							return _this3.showCheckboxes(id);
						} },
					_react2.default.createElement(
						'select',
						_extends({}, inputProps, {
							className: 'input input-select-checkbox',
							style: style
						}),
						_react2.default.createElement(
							'option',
							null,
							this.renderSelectedLabel()
						),
						options.map(function (o) {
							return _react2.default.createElement(
								'option',
								null,
								o.label
							);
						})
					),
					_react2.default.createElement('div', { id: 'overSelect-' + id, className: 'overSelect checkboxes-' + id })
				),
				_react2.default.createElement(
					'div',
					{ id: 'checkboxes-' + id, className: 'checkboxes' },
					options.map(function (option, i) {
						return _react2.default.createElement(
							'label',
							{ htmlFor: option.value + '-' + id, className: 'input-select-option checkboxes-' + id },
							_react2.default.createElement('input', {
								type: 'checkbox',
								id: option.value + '-' + id,
								className: 'checkboxes-' + id,
								value: option.value,
								onChange: function onChange(e) {
									return _this3.onChange({ checked: e.target.checked, value: option.value, selectedOption: option, e: e });
								},
								checked: _this3.isSelected(option)
							}),
							option.label
						);
					})
				)
			);
		}
	}]);

	return InputSelect;
}(_react.Component);

InputSelect.defaultProps = {
	options: [],
	value: [],
	//searchable: true,
	//isMulti: false,
	optionValue: 'value',
	optionLabel: 'label',
	width: null
	//clearAllText: 'Remover todos',
	//placeholder: '',
	//noResultsText: 'Nenhum resultado encontrado.',
	//onChange: () => console.log('onchange não definido'),
	//autoFocus: false,
	// getOptionLabel: option => null,
};

exports.default = InputSelect;