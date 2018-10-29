import React from 'react';
import tinycolor from 'tinycolor2';
import PropTypes from 'prop-types';
import './ColorInput.less';
import ColorSelector from './ColorSelector';


class ColorInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    this.setState({
      selected: !this.state.selected
    });
  }

  render() {
    let { value, onChange, name } = this.props;
    let element;
    let color = tinycolor.fromRatio(value);
    if(this.state.selected) {
      element = (
        <div className="color-input">
          <ColorSelector value={value} onChange={onChange} />
          <button onClick={this.onClick}>OK</button>
        </div>
      );
    } else {
      element = (
        <div className="color-input">
          <div className="display" onClick={this.onClick} style={{ backgroundColor: color.toHexString() }} />
          <span>{name}</span>
        </div>
      );
    }
    return element;
  }
}

ColorInput.propTypes = {
  value: PropTypes.object,
  name: PropTypes.string,
  onChange: PropTypes.func
};

export default ColorInput;
