import React, { Component, useState, useEffect } from 'react';
import './select-check-box.css';


function convertOptions({ options, optionValue, optionLabel, labelRenderer }) {
	return options.map(option => ({ value: option[optionValue], label: labelRenderer ? labelRenderer(option) : option[optionLabel] })).slice();
}

class InputSelect extends Component {
	constructor(props) {
		super(props);

		const { value, optionValue, optionLabel, labelRenderer } = props;
		const values = value;
		const options = convertOptions({ options: props.options, optionValue, optionLabel, labelRenderer });

		this.state = {
			values,
			options,
			selectedOptions: this.getSelected({ options, values }),
			//initialOptions: options,

		};

		document.addEventListener('click', e => {
			const target = e.target;
			const evtClassName = target ? target.className : null;
			// const path = event.path || (event.composedPath && event.composedPath());
			const checkboxes = document.getElementsByClassName("checkboxes");

			for (let i = 0; i < checkboxes.length; i++) {
				const checkboxe = checkboxes[i];
				if (!evtClassName.includes(checkboxe.id)) {
					checkboxe.style.display = "none";
				}
			}
		}, true);

		this.showCheckboxes = this.showCheckboxes.bind(this)
	}

	componentWillReceiveProps({ value, options, optionValue, optionLabel, labelRenderer }) {
		if (options !== this.props.options) {
			this.setState({
				options: convertOptions({ options, optionValue, optionLabel, labelRenderer }),
				selectedOptions: this.getSelected({ values: value, options }),
			})
		}
		if (value !== this.props.value) {
			this.setState({
				values: value,
				selectedOptions: this.getSelected({ values: value, options }),
			})
		}
	}

	onChange({ checked, value, selectedOption }) {
		const { onChange, id } = this.props;
		const { options } = this.state;
		const values = this.state.values.slice();
		if (checked) {
			values.push(value);
		} else {
			const indexSelected = values.indexOf(value);
			values.splice(indexSelected, 1);
		}
		const selectedOptions = this.getSelected({ values, options });
		this.setState({ values, selectedOptions }, () => {
			this.props.onChange({ id, value: values, selectedValue: value, selectedOption, selectedOptions })
		})

	}

	getSelected({ options, values }) {
		return options.filter(o => values.includes(o.value));
	}

	isSelected(option) {
		return this.state.values.some(v => {
			return JSON.stringify(v) === JSON.stringify(option.value);
		});
	}

	renderSelectedLabel() {
		return this.state.selectedOptions.map(o => o.label).join(', ');
	}

	showCheckboxes(id) {
		const checkboxes = document.getElementById(`checkboxes-${id}`);
		checkboxes.style.display = ["none", ""].includes(checkboxes.style.display) ? "block" : "none";

	}
	render() {
		const { id, label, placeholder, optionValue, optionLabel, labelRenderer, width, style, styleContainer, ...inputProps } = this.props;
		const { options } = this.state;

		return (
			<div id={`multiselect-${id}`} className="multiselect" style={styleContainer}>
				<div id={`selectBox-${id}`} className="selectBox" onClick={() => this.showCheckboxes(id)}>
					<select
						{...inputProps}
						className="input input-select-checkbox"
						style={style}
					>
						<option>{this.renderSelectedLabel()}</option>
						{options.map(o => <option>{o.label}</option>)}
					</select>
					<div id={`overSelect-${id}`} className={`overSelect checkboxes-${id}`}></div>
				</div>
				<div id={`checkboxes-${id}`} className="checkboxes">
					{options.map((option, i) => (
						<label htmlFor={`${option.value}-${id}`} className={`input-select-option checkboxes-${id}`}>
							<input
								type="checkbox"
								id={`${option.value}-${id}`}
								className={`checkboxes-${id}`}
								value={option.value}
								onChange={(e) => this.onChange({ checked: e.target.checked, value: option.value, selectedOption: option, e })}
								checked={this.isSelected(option)}
							/>
							{option.label}
						</label>
					))}
				</div>
			</div>);

	}

}

InputSelect.defaultProps = {
	options: [],
	value: [],
	//searchable: true,
	//isMulti: false,
	optionValue: 'value',
	optionLabel: 'label',
	width: null,
	//clearAllText: 'Remover todos',
	//placeholder: '',
	//noResultsText: 'Nenhum resultado encontrado.',
	//onChange: () => console.log('onchange não definido'),
	//autoFocus: false,
	// getOptionLabel: option => null,
};

export default InputSelect;


