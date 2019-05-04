import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '../gfx/Renderer';
import VectorOverlay from './node/inputs/VectorOverlay';
import './RenderCanvas.less';


class RenderCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.setCanvas = this.setCanvas.bind(this);
  }

  componentDidMount() {
    if(this.canvas !== undefined) {
      this.renderer = new Renderer(this.canvas);
      this.renderer.render(this.props.nodes, this.props.connections, true);
      window.onresize = () => {
        this.renderer.resizeCanvas();
        this.renderer.render(this.props.nodes, this.props.connections, true);
      };
    }
  }

  onValueChange(name, value) {
    this.props.changeValue(this.props.id, { [name]: value });
  }

  shouldComponentUpdate(nextProps) {
    let a = nextProps.pan;
    let b = this.props.pan;
    return (a[0] === b[0] && a[1] === b[1]);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  render() {
    let { selectedNode } = this.props;
    if(this.renderer) {
      this.renderer.render(this.props.nodes, this.props.connections);
    }
    let canvasOverlayInputs;
    if(selectedNode !== undefined && selectedNode.type.values !== undefined) {
      canvasOverlayInputs = Object.keys(selectedNode.type.values).map(key => {
        let nodeValue = selectedNode.type.values[key];
        switch(nodeValue.type) {
          case 'vector':
            return (
              <VectorOverlay
                key={key}
                name={key}
                type={nodeValue}
                value={selectedNode.values[key]}
                onChange={(value) => this.onValueChange(key, value)}
              />
            );
          default:
            break;
        }
        return null;
      });
    }

    return (
      <div>
        <canvas
          width="1024"
          height="1024"
          className="render-canvas"
          ref={this.setCanvas}
        />
        {canvasOverlayInputs}
      </div>);
  }
}

RenderCanvas.propTypes = {
  nodes: PropTypes.object.isRequired,
  connections: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  selectedNode: PropTypes.object,
  changeValue: PropTypes.func.isRequired,
  pan: PropTypes.array.isRequired
};

export default RenderCanvas;
