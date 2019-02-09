import React from 'react';
import PropTypes from 'prop-types';

class EnumInput extends React.Component {
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
    let options = type.values.map(val => (<option key={val}>{val}</option>));
    return [
      <label key="label" htmlFor={name}>{type.name}
        <select key="select" value={value} onChange={this.onChange}>
          {options}
        </select>
      </label>,
    ];
  }
}

EnumInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default EnumInput;
