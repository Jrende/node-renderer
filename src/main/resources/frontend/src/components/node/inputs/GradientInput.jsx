import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import './GradientInput.less';

class GradientInput extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
		let pos = [event.clientX, event.clientY];
		this.props.showGradientPicker(this.props.nodeId, this.props.name, this.props.value, pos);
  }

  render() {
    let { value, type } = this.props;
    let { selected } = this.state;
    let gradientString = '';
    for(let i = 0; i < value.length; i++) {
      let stop = value[i];
      let color = tinycolor.fromRatio(stop.color);
      let position = stop.position * 100;
      gradientString += `, ${color.toHexString()} ${position}%`;
    }
    let gradientStyle = {
      backgroundImage: `linear-gradient(to right${gradientString})`
    };
    return (
      <div className="gradient-editor">
        <span>{type.name}</span>
        <div className="display" style={gradientStyle} onClick={this.onClick} />
      </div>
    );
  }
}

GradientInput.propTypes = {
	hasConnection: PropTypes.bool,
	name: PropTypes.string,
  value: PropTypes.object,
  type: PropTypes.object,
  onChange: PropTypes.func,
	showGradientPicker: PropTypes.func.isRequired
};

export default GradientInput;
