import React from 'react';
import PropTypes from 'prop-types';

import GraphEditor from '../components/grapheditor/GraphEditor';
import ToolBox from '../components/ToolBox';
import MenuItems from '../containers/MenuItems';
import RenderCanvas from '../containers/RenderCanvas';
import './Editor.less';

let root = document.querySelector('#root');
class Editor extends React.Component {
  constructor() {
    super();
    this.back = this.back.bind(this);
    this.keyDownEvent = this.keyDownEvent.bind(this);
    this.state = {
      lastPos: 0,
      pos: 50
    };
    this.onResizeMouseDown = this.onResizeMouseDown.bind(this);
    this.onResizeMouseMove = this.onResizeMouseMove.bind(this);
  }

  back() {
    if(this.props.selectedNode !== -1) {
      this.props.selectNode(-1);
    } else if (this.props.showToolBox) {
      this.props.setToolBoxVisibility(false);
    }
  }

  onResizeMouseDown(event) {
    event.preventDefault();
    console.log('strt drag');
    root.addEventListener('mousemove', this.onResizeMouseMove);
    root.addEventListener('mouseup', this.onResizeMouseMove);
  }

  onResizeMouseMove(event) {
    if(event.buttons === 0) {
      console.log('stop drag');
      root.removeEventListener('mousemove', this.onResizeMouseMove);
      return;
    }

    let deltaX = this.state.lastPos - event.clientX;
    console.log('deltaX: ' + deltaX);
    console.log('x: ' + event.clientX);
    this.setState({
      lastPos: event.clientX
    });
  }


  componentDidMount() {
    root.addEventListener('keydown', this.keyDownEvent);
    let id = +window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
    if(!Number.isNaN(id) && id !== 0) {
      if(window.initialGraph !== undefined) {
        this.props.setGraph(window.initialGraph);
      } else {
        this.props.fetchGraph(id);
      }
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
    root.removeEventListener('keyDown', this.keyDownEvent);
  }

  render() {
    let graphOrNodepicker;
    if(this.props.showToolBox && this.props.grabbedNodeType == null) {
      graphOrNodepicker = (
        <div key="toolbox-control" className="toolbox-control">
          <button key="btn" className="back" onClick={this.back}>Back</button>
          <ToolBox key="graphOrNodepicker" />
        </div>
      );
    } else {
      graphOrNodepicker = (
        <div key="svg-control" className="svg-control">
          <button key="btn" className="add-new-node" onClick={() => this.props.setToolBoxVisibility(true)}>+</button>
          <GraphEditor key="graphOrNodepicker" />
        </div>
      );
    }


    return [
      <nav key="Menu Bar" className="menu-bar">
        <MenuItems match={this.props.match} />
      </nav>,
      <div key="RenderCanvas" className="canvas">
        <RenderCanvas />
        {(this.props.grabbedNodeType !== null) && <div className="node-grab-overlay" />}
      </div>,
      <div key="resize-dragger" onMouseDown={this.onResizeMouseDown} className="resize-dragger">···</div>,
      graphOrNodepicker
    ];
  }
}


Editor.propTypes = {
  fetchGraph: PropTypes.func.isRequired,
  setGraph: PropTypes.func.isRequired,
  loadEmptyGraph: PropTypes.func.isRequired,
  selectedNode: PropTypes.number.isRequired,
  selectNode: PropTypes.func.isRequired,
  grabbedNodeType: PropTypes.object,
  setToolBoxVisibility: PropTypes.func.isRequired,
  showToolBox: PropTypes.bool.isRequired
};
export default Editor;
