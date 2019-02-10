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
    let input;
    if(this.props.showToolBox && this.props.grabbedNodeType == null) {
      input = (
        <div key="toolbox-control" className="toolbox-control">
          <button key="btn" className="back" onClick={this.back}>Back</button>
          <ToolBox key="input" />
        </div>
      );
    } else {
      input = (
        <div key="svg-control" className="svg-control">
          <button key="btn" className="add-new-node" onClick={() => this.props.setToolBoxVisibility(true)}>+</button>
          <GraphEditor key="input" />
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
      input
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
