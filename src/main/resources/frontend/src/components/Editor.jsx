import React from 'react';
import PropTypes from 'prop-types';

import SvgRenderer from '../containers/SvgRenderer';
import ToolBox from '../containers/ToolBox';
import NodeInputs from '../containers/NodeInputs';
import MenuItems from '../containers/MenuItems';
import RenderCanvas from '../containers/RenderCanvas';
import './Editor.less';

class Editor extends React.Component {
  /* global location */
  componentDidMount() {
    let id = +location.pathname.substr(1);
    if(!Number.isNaN(id) && id !== 0) {
      this.props.setGraph(window.initialGraph);
    } else {
      this.props.loadEmptyGraph();
    }
  }

  render() {
    let input;
    if(this.props.selectedNode !== -1) {
      input = (
        <div key="Inputs" className="node-inputs">
          <NodeInputs />
        </div>);
    }
    return [
      <nav key="Menu Bar" className="menu-bar">
        <MenuItems match={this.props.match} />
      </nav>,
      <div key="Svg Renderer" className="svg-renderer">
        <SvgRenderer />
      </div>,
      <div key="ToolBox" className="tool-box">
        <ToolBox />
      </div>,
      <div key="RenderCanvas" className="canvas">
        <RenderCanvas />
      </div>,
      input
    ];
  }
}


Editor.propTypes = {
  setGraph: PropTypes.func.isRequired,
  loadEmptyGraph: PropTypes.func.isRequired,
  selectedNode: PropTypes.number.isRequired
};
export default Editor;
