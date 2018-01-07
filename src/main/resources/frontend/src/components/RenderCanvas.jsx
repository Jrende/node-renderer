import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '../gfx/Renderer';
import './RenderCanvas.less';


class RenderCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.setCanvas = this.setCanvas.bind(this);
  }

  componentDidMount() {
    if(this.canvas !== undefined) {
      this.renderer = new Renderer(this.canvas);
      this.renderer.render(this.props.graph);
      window.onresize = () => {
        this.renderer.render(this.props.graph, true);
      };
    }
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  render() {
    if(this.renderer) {
      this.renderer.render(this.props.graph);
    }
    return (<canvas
      width="1024"
      height="1024"
      className="render-canvas"
      ref={this.setCanvas}
    />);
  }
}

RenderCanvas.propTypes = {
  graph: PropTypes.object.isRequired,
};

export default RenderCanvas;
