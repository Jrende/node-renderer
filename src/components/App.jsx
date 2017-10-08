import React from 'react'
import SvgRenderer from '../containers/SvgRenderer'
import ToolBox from '../containers/ToolBox'
import NodeInputs from '../containers/NodeInputs'
import './App.less';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: "svg"
    }
    this.selectTab = this.selectTab.bind(this);
  }

  selectTab(tab) {
    this.setState({ tab });
  }

  render() {
    let elm;
    console.log("tab", this.state.tab);
    switch(this.state.tab) {
      case "svg":
        elm = <SvgRenderer key="renderer" />;
        break;
      case "render":
        elm = <canvas className="node-svg" key="canvas" />;
        break;
      default:
    }

    return [
      <NodeInputs key="NodeInputs" />,
      <div key="tabs" className="tabs">
        <button onClick={() => this.selectTab("svg")}>svg</button>
        <button onClick={() => this.selectTab("render")}>render</button>
      </div>,
      elm,
      <ToolBox key="ToolBox" />
    ]
  }
}

