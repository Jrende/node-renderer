import React from 'react';
import PropTypes from 'prop-types';

import SvgRenderer from '../containers/SvgRenderer';
import ToolBox from '../components/ToolBox';
import NodeInputs from '../containers/NodeInputs';
import MenuItems from '../containers/MenuItems';
import RenderCanvas from '../containers/RenderCanvas';
import NodeGrabOverlay from '../components/NodeGrabOverlay';
import './Editor.less';

class Editor extends React.Component {
  constructor() {
    super();
    this.back = this.back.bind(this);
  }

  back() {
    if(this.props.selectedNode !== -1) {
      this.props.selectNode(-1);
    } else if (this.props.showToolBox) {
      this.props.setToolBoxVisibility(false);
    }
  }

  componentDidMount() {
    let id = +window.location.pathname.substr(1);
    if(!Number.isNaN(id) && id !== 0) {
      this.props.setGraph(window.initialGraph);
    } else {
      this.props.loadEmptyGraph();
    }
  }

  render() {
    let input;
    if(this.props.selectedNode !== -1) {
      input = [
        <button className="back" onClick={this.back}>Back</button>,
        <NodeInputs />
      ];
    } else if(this.props.showToolBox && this.props.grabbedNodeType == null) {
      input = [
        <button className="back" onClick={this.back}>Back</button>,
        <ToolBox />
      ];
    } else {
      input = [
        <button className="addNode" onClick={() => this.props.setToolBoxVisibility(true)}>Add new node</button>,
        <SvgRenderer />
      ];
    }
    let nodeGrabOverlay;
    if(this.props.grabbedNodeType !== null) {
      nodeGrabOverlay = (<NodeGrabOverlay />);
    }
    return [
      <nav key="Menu Bar" className="menu-bar">
        <MenuItems match={this.props.match} />
      </nav>,
      <div key="RenderCanvas" className="canvas">
        <RenderCanvas />
      </div>,
      <div key="Control" className="control">
        {input}
      </div>,
      nodeGrabOverlay
    ];
  }
}


Editor.propTypes = {
  setGraph: PropTypes.func.isRequired,
  loadEmptyGraph: PropTypes.func.isRequired,
  selectedNode: PropTypes.number.isRequired,
  selectNode: PropTypes.func.isRequired,
  grabbedNodeType: PropTypes.object,
  setToolBoxVisibility: PropTypes.func.isRequired,
  showToolBox: PropTypes.bool.isRequired
};
export default Editor;
