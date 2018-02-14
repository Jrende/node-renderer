import React from 'react';
import PropTypes from 'prop-types';
import './GradientInput.less';
import tinycolor from 'tinycolor2';

class GradientInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
  }

  render() {
    let { value } = this.props;
    let gradientString = "";
    value.forEach(stop => {
      let color = tinycolor.fromRatio(stop.color);
      gradientString += `, ${color.toHexString()} ${stop.stop * 100}%`
    });
    let gradientStyle = {
      backgroundImage: `linear-gradient(to left${gradientString})`
    }
    return (
      <div className="gradient-display" style={gradientStyle}></div>
    );
  }
}

GradientInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GradientInput;
