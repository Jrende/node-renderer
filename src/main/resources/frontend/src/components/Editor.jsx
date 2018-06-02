import React from 'react';
import PropTypes from 'prop-types';

import SvgRenderer from '../containers/SvgRenderer';
import ToolBox from '../containers/ToolBox';
import NodeInputs from '../containers/NodeInputs';
import MenuItems from '../containers/MenuItems';
import RenderCanvas from '../containers/RenderCanvas';
import './Editor.less';

class Editor extends React.Component {
  constructor() {
    super();
    this.state = {
      showNewNodeDialog: false
    };
    this.back = this.back.bind(this);
  }

  back() {
    if(this.props.selectedNode !== -1) {
      this.props.selectNode(-1);
    } else if (this.state.showNewNodeDialog) {
      this.setState({
        showNewNodeDialog: false
      });
    }
  }

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
      input = [
        <button className="back" onClick={this.back}>Back</button>,
        <NodeInputs />
      ];
    } else if(this.state.showNewNodeDialog) {
      input = [
        <button className="back" onClick={this.back}>Back</button>,
        <ToolBox />
      ];
    } else {
      input = [
        <button className="addNode" onClick={() => this.setState({ showNewNodeDialog: true })}>Add new node</button>,
        <SvgRenderer />
      ];
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
      </div>
    ];
  }
}


Editor.propTypes = {
  setGraph: PropTypes.func.isRequired,
  loadEmptyGraph: PropTypes.func.isRequired,
  selectedNode: PropTypes.number.isRequired,
  selectNode: PropTypes.func.isRequired,
};
export default Editor;
