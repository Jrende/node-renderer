import React from 'react';
import PropTypes from 'prop-types';
import './NumberInput.less';


class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    parseFloat(this.props.onChange(event.target.value));
  }

  render() {
    let { name, type, value } = this.props;
    let typeName = name;
    if(type.name !== undefined) {
      typeName = name;
    }
    let validValue = value;
    if(isNaN(value)) {
      validValue = 0;
    }


    let range;
    if(type.max !== undefined && type.min !== undefined) {
      range = (
        <input
          type="range"
          max={type.max}
          min={type.min}
          step=".01"
          value={validValue}
          onChange={this.onChange}
        />);
    }

    return (
      <fieldset className="number-input">
        <label htmlFor={name}>{typeName}</label>
        <input type="number" name={name} value={validValue} onChange={this.onChange} />
        {range}
      </fieldset>
    );
  }
}

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default NumberInput;
