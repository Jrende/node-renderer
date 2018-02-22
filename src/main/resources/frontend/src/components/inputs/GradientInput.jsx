import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import './GradientInput.less';
import ColorInput from './ColorInput/ColorInput';

let root = document.querySelector('#root');
class GradientInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPos: 0,
      dragId: -1,
      selected: -1
    };

    this.setGradientDisplay = this.setGradientDisplay.bind(this);
    this.onMarkerMouseDown = this.onMarkerMouseDown.bind(this);
    this.onMarkerMouseMove = this.onMarkerMouseMove.bind(this);
  }

  onMarkerMouseDown(event, id) {
    event.preventDefault();
    root.addEventListener('mousemove', this.onMarkerMouseMove);
    this.setState({
      dragId: id,
      selected: id,
      lastPos: event.clientX
    });
  }

  onMarkerMouseMove(event) {
    if(event.buttons === 0) {
      root.removeEventListener('mousemove', this.onMarkerMouseMove);
      this.setState({
        dragId: -1
      });
      return;
    }

    let deltaX = this.state.lastPos - event.clientX;
    let newGradient = this.props.value.map(stop => {
      if(stop === this.props.value[this.state.dragId]) {
        let newPosition = stop.position - deltaX / this.gradientDisplay.clientWidth;
        return Object.assign({}, stop, {
          position: newPosition
        });
      }
      return stop;
    });

    this.onChange(newGradient);
    this.setState({
      lastPos: event.clientX
    });
  }

  onMarkerMouseUp(event) {
    event.preventDefault();
    root.removeEventListener('mousemove', this.onMarkerMouseMove);
    this.setState({ dragId: -1 });
  }

  setGradientDisplay(elm) {
    this.gradientDisplay = elm;
  }

  onChange(newGradient) {
    let selected = newGradient[this.state.dragId];
    let sorted = newGradient.concat().sort((a, b) => a.position - b.position);
    let newSelected = sorted[this.state.dragId];
    if(selected !== newSelected) {
      let newDragId = sorted.indexOf(selected);
      this.setState({ dragId: newDragId, selected: newDragId });
    }
    this.props.onChange(sorted);
  }

  colorChange(newColor, id) {
    let stopToChange = this.props.value[id];
    let newGradient = this.props.value.map(stop => {
      if(stop === stopToChange) {
        return Object.assign({}, stop, {
          color: newColor
        });
      }
      return stop;
    });
    this.props.onChange(newGradient);
  }
  render() {
    let { value } = this.props;
    let { selected } = this.state;
    let gradientString = '';
    let markers = [];
    for(let i = 0; i < value.length; i++) {
      let stop = value[i];
      let color = tinycolor.fromRatio(stop.color);
      let position = stop.position * 100;

      gradientString += `, ${color.toHexString()} ${position}%`;
      let markerStyle = {};
      markerStyle.left = `calc(${position}% - 1em)`;
      markers.push((
        <div
          key={i}
          role="slider"
          tabIndex="0"
          aria-valuemax="100"
          aria-valuemin="0"
          aria-valuenow={position}
          className="marker"
          onMouseUp={(event) => this.onMarkerMouseUp(event, i)}
          onMouseDown={(event) => this.onMarkerMouseDown(event, i)}
          style={markerStyle}
        >
          <div className="triangle" />
          <div className="color-display">
            <div className="inner" style={{ backgroundColor: color.toHexString() }} />
          </div>
        </div>
      ));
    }
    let gradientStyle = {
      backgroundImage: `linear-gradient(to right${gradientString})`
    };
    return (
      <div className="gradient-editor">
        <div className="display" style={gradientStyle} ref={this.setGradientDisplay} />
        <div className="markers">
          {markers}
        </div>
        {selected !== -1 &&
          <ColorInput
            value={value[selected].color}
            onChange={(newValue) => this.colorChange(newValue, selected)}
          />
        }
      </div>
    );
  }
}

GradientInput.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GradientInput;
