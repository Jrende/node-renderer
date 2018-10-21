import React from 'react';
import PropTypes from 'prop-types';

import SvgRenderer from '../containers/SvgRenderer';
import ToolBox from '../components/ToolBox';
import NodeInputs from '../containers/NodeInputs';
import MenuItems from '../containers/MenuItems';
import RenderCanvas from '../containers/RenderCanvas';
import NodeGrabOverlay from '../components/NodeGrabOverlay';
import './Editor.less';

let root = document.querySelector('#root');
class Editor extends React.Component {
  constructor() {
    super();
    this.back = this.back.bind(this);
    this.keyDownEvent = this.keyDownEvent.bind(this);
  }

  back() {
    if(this.props.selectedNode !== -1) {
      this.props.selectNode(-1);
    } else if (this.props.showToolBox) {
      this.props.setToolBoxVisibility(false);
    }
  }

  componentDidMount() {
    root.addEventListener('keydown', this.keyDownEvent);
    let id = +window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
    if(!Number.isNaN(id) && id !== 0) {
      this.props.setGraph(window.initialGraph);
    } else {
      this.props.loadEmptyGraph();
    }
  }

  keyDownEvent(event) {
    if(event.keyCode === 32) {
      this.props.setToolBoxVisibility(true);
    }
  }

  componentWillUnmount() {
    console.log('remove listener');
    root.removeEventListener('keyDown', this.keyDownEvent);
  }

  render() {
    let input;
    if(this.props.selectedNode !== -1) {
      input = [
        <button key="btn" className="back" onClick={this.back}>Back</button>,
        <NodeInputs key="input" />
      ];
    } else if(this.props.showToolBox && this.props.grabbedNodeType == null) {
      input = [
        <button key="btn" className="back" onClick={this.back}>Back</button>,
        <ToolBox key="input" />
      ];
    } else {
      input = [
        <button key="btn" className="addNode" onClick={() => this.props.setToolBoxVisibility(true)}>Add new node</button>,
        <SvgRenderer key="input" />
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
        {nodeGrabOverlay}
        <RenderCanvas />
      </div>,
      <div key="Control" className="control">
        {input}
      </div>
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
