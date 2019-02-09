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
    let {
      value,
      type,
      onChange,
      hasConnection
    } = this.props;
    let color = tinycolor.fromRatio(value);
    let name = type.name;

    if(hasConnection) {
      return (
        <div className="color-input has-connection">
          <span>{name}</span>
        </div>
      );
    }

    if(this.state.selected) {
      return (
        <div className="color-input">
          <ColorSelector value={value} onChange={onChange} />
          <button onClick={this.onClick}>OK</button>
        </div>
      );
    }

    return (
      <div className="color-input">
        <div className="display" onClick={this.onClick} style={{ backgroundColor: color.toHexString() }} />
        <span>{name}</span>
      </div>
    );
  }
}

ColorInput.propTypes = {
  value: PropTypes.object,
  type: PropTypes.object,
  onChange: PropTypes.func
};

export default ColorInput;
