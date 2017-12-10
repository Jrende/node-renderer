import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import draggable from '../../utils/DragDrop.js';
import Renderer from '../../gfx/Renderer';
import './RenderCanvas.less';


class RenderCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.setCanvas = this.setCanvas.bind(this);
  }

  setCanvas(canvas) {
    if(canvas) {
      this.renderer = new Renderer(canvas);
      this.renderer.render(this.props.rootNode);
    }
  }

  render() {
    if(this.renderer) {
      this.renderer.render(this.props.rootNode);
    }
    return <canvas width="1024" height="1024" className="render-canvas" ref={this.setCanvas}></canvas>
  }
}

RenderCanvas.propTypes = {
  rootNode: PropTypes.object.isRequired
}

export default RenderCanvas;
