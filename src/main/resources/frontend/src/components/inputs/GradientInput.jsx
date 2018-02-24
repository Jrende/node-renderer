import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import './GradientInput.less';
import ColorInput from './ColorInput/ColorInput';

function getAllOffsetLeft(elm) {
  let offsetLeft = 0;
  while(elm !== null) {
    offsetLeft += elm.offsetLeft;
    elm = elm.offsetParent;
  }
  return offsetLeft;
}

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
    this.onClickDisplay = this.onClickDisplay.bind(this);
  }

  onDeleteStopClick(id) {
    let newGrad = this.props.value.slice();
    newGrad.splice(id, 1);
    this.onChange(newGrad);
    this.setState({
      selected: -1
    });
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

    let selected = this.state.selected;
    if(selected !== 0 && selected !== this.props.value.length - 1) {
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

  onClickDisplay(event) {
    let pos = (event.pageX - getAllOffsetLeft(this.gradientDisplay)) / this.gradientDisplay.offsetWidth;
    let newStopIndex = -1;
    let grad = this.props.value;
    for(let i = 1; i < grad.length; i++) {
      if(grad[i - 1].position < pos && grad[i].position > pos) {
        let newStop = {
          position: pos,
          color: this.getColorAtPos(pos)
        };
        grad.splice(i, 0, newStop);
        break;
      }
    }

    this.onChange(grad);
  }

  getColorAtPos(position) {
    let from, to;
    let grad = this.props.value;
    for(let i = 1; i < grad.length; i++) {
      if(grad[i - 1].position < position && grad[i].position > position) {
        from = grad[i - 1];
        to = grad[i];
        break;
      }
    }

    let fromCol = tinycolor.fromRatio(from.color);
    let toCol = tinycolor.fromRatio(to.color);

    let pos = position - from.position;
    let toPos = to.position - from.position;
    let amount = pos/toPos;
    //let amount = (to.position - from.position) / to.position;

    let color = tinycolor.mix(fromCol, toCol, amount * 100).toRgb();
    color.r /= 255;
    color.g /= 255;
    color.b /= 255;
    return color;
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
      let className = 'marker';
      if(this.state.selected === i) {
        className += ' selected';
      }
      markers.push((
        <div
          key={i}
          role="slider"
          tabIndex="0"
          aria-valuemax="100"
          aria-valuemin="0"
          aria-valuenow={position}
          className={className}
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
        <div className="display" style={gradientStyle} ref={this.setGradientDisplay} onClick={this.onClickDisplay} />
        <div className="markers">
          {markers}
        </div>
        {selected !== -1 &&
          <div>
          {(selected !== 0 && selected !== this.props.value.length - 1) &&
            <button onClick={event => this.onDeleteStopClick(selected)}>Delete stop</button>}
          <ColorInput
            value={value[selected].color}
            onChange={(newValue) => this.colorChange(newValue, selected)}
          />
        </div>
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
