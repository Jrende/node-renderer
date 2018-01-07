import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

class ColorInput extends React.Component {
  constructor(props) {
    super(props);
    this.gl = null;
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let value = event.target.value;
    let color = tinycolor(value);
    this.props.onChange(color.toRgb());
  }

  render() {
    let { name, type, value } = this.props;
    let color = tinycolor(value);
    return (
      <fieldset>
        <label htmlFor={name}>
          {type.name}: <input
            id={name}
            onChange={this.onChange}
            type="color"
            value={color.toHexString()}
          />
        </label>
      </fieldset>
    );
  }
}

ColorInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func
};

export default ColorInput;
