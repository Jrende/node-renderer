import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './ColorInput.less';
import tinycolor from 'tinycolor2';

let root = document.querySelector('#root');
class ColorInput extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			element: undefined
		};
		this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
		let pos = [event.clientX, event.clientY];
		this.props.showColorPicker(this.props.nodeId, this.props.name, this.props.value, pos);
  }

  render() {
		let color = tinycolor.fromRatio(this.props.value);
		let style = {
			backgroundColor: color.toHexString()
		}
    return (
			<button onClick={this.onClick} style={style} className="color-input"></button>
    );
  }
}

ColorInput.propTypes = {
	hasConnection: PropTypes.bool,
	name: PropTypes.string,
  value: PropTypes.object,
  type: PropTypes.object,
  onChange: PropTypes.func,
	showGradientPicker: PropTypes.func.isRequired
};

export default ColorInput;
