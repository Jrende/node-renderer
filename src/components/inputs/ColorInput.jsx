import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ColorInput extends React.Component {
  constructor(props) {
    super(props);
    this.gl = null;
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    let { name, type, value } = this.props;
    return (
      <fieldset>
        <label htmlFor={name}>{type.name}</label>
        <input onChange={this.onChange} type="color" />
      </fieldset>
    );
  }
}

ColorInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default ColorInput;
