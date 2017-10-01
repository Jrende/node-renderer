import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './NumberInput.less';


class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onChange(event.target.value|0);
  }

  render() {
    let { name, type, value } = this.props;

    return (
      <fieldset className="number-input">
        <label htmlFor={name}>{type.name}</label>
        <input type="number" name={name} value={value} onChange={this.onChange} />
        <input type="range" max={type.max} min={type.min} step=".01" value={value} onChange={this.onChange} />
      </fieldset>
    );
  }
}

NumberInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.object,
  value: PropTypes.number,
  onChange: PropTypes.func
}

export default NumberInput;
