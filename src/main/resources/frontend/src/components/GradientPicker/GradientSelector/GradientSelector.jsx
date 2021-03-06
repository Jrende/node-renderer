import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import './GradientSelector.less';
import ColorSelector from './ColorSelector';

let root = document.querySelector('#root');
class GradientSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPos: 0,
      dragId: -1,
      selected: -1
    };

    this.setGradientEditor = this.setGradientEditor.bind(this);
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

    let deltaX = this.state.lastPos - event.clientX;
    let rect = this.gradientDisplay.getBoundingClientRect();
    let newGradient = this.props.value.map(stop => {
      if(stop === this.props.value[this.state.dragId]) {
        let p = stop.position - deltaX / rect.width;
        let newPosition = Math.min(Math.max(p, 0.0), 1.0);
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

  setGradientEditor(elm) {
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
    let rect = this.gradientDisplay.getBoundingClientRect();
    let pos = (event.pageX - rect.x);
    pos /= rect.width;
    let grad = this.props.value;
    let index = -1;
    if(pos < grad[0].position) {
      index = 0;
    } else if(pos > grad[grad.length - 1].position) {
      index = grad.length;
    } else {
      for(let i = 1; i < grad.length; i++) {
        if(grad[i - 1].position < pos && grad[i].position > pos) {
          index = i;
          break;
        }
      }
    }

    grad.splice(index, 0, {
      position: pos,
      color: this.getColorAtPos(pos)
    });
    this.onChange(grad);
    this.setState({ selected: index });
  }

  getColorAtPos(position) {
    let from;
    let to;
    let grad = this.props.value;
    if(position < grad[0].position) {
      return grad[0].color;
    } else if(position > grad[grad.length - 1].position) {
      return grad[grad.length - 1].color;
    }

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
    let { value, type } = this.props;
    let { selected } = this.state;
    let gradientString = '';
    let markers = [];
    // let rect = this.gradientDisplay.getBoundingClientRect();
    for(let i = 0; i < value.length; i++) {
      let stop = value[i];
      let color = tinycolor.fromRatio(stop.color);
      let position = stop.position * 100;

      gradientString += `, ${color.toHexString()} ${position}%`;
      let markerStyle = {
        left: `calc(${position}%)`,
      };
      let className = 'marker';
      if(this.state.selected === i) {
        className += ' selected';
      }
      if(this.state.dragId === i) {
        className += ' grabbing';
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
          <div className="marker-inner">
            <div className="triangle" />
            <div className="color-display">
              <div
                style={{
                  backgroundColor: color.toHexString()
                }}
              />
            </div>
          </div>
        </div>
      ));
    }
    let gradientStyle = {
      backgroundImage: `linear-gradient(to right${gradientString})`
    };
    return (
      <div className="gradient-editor" ref={this.setGradientEditor}>
        <span>{type.name}</span>
        <div className="display" style={gradientStyle} onClick={this.onClickDisplay} />
        <div className="markers">
          {markers}
        </div>
        {selected !== -1 &&
          <div>
            {(selected !== 0 && selected !== this.props.value.length - 1) &&
              <button onClick={() => this.onDeleteStopClick(selected)}>Delete stop</button>}
            <ColorSelector
              value={value[selected].color}
              onChange={(newValue) => this.colorChange(newValue, selected)}
            />
          </div>
        }
      </div>
    );
  }
}

GradientSelector.propTypes = {
  type: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GradientSelector;
