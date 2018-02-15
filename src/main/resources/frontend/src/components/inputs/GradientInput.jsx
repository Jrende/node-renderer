import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import './GradientInput.less';

class GradientInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    // this.props.onChange(name, value)
  }

  render() {
    let { value } = this.props;
    let gradientString = '';
    let markers = [];
    for(let i = 0; i < value.length; i++) {
      let stop = value[i];
      let color = tinycolor.fromRatio(stop.color);
      let position = stop.stop * 100;

      gradientString += `, ${color.toHexString()} ${position}%`;
      let markerStyle = {};
      markerStyle.left = `calc(${position}% - 1em)`;
      markers.push((
        <div key={i} className="marker" style={markerStyle}>
          <div className="triangle" />
          <div className="color-display">
            <div className="inner" style={{ backgroundColor: color.toHexString() }} />
          </div>
        </div>
      ));
    }
    let gradientStyle = {
      backgroundImage: `linear-gradient(to left${gradientString})`
    };
    return (
      <div className="gradient-editor">
        <div className="display" style={gradientStyle} />
        <div className="markers">
          {markers}
        </div>
      </div>
    );
  }
}

GradientInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GradientInput;
