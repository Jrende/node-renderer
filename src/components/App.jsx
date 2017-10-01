import React from 'react'
import SvgRenderer from '../containers/SvgRenderer'
import ToolBox from '../containers/ToolBox'
import NodeInputs from '../containers/NodeInputs'
import './App.less';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedNode: undefined
    };
    this.onSelectNode = this.onSelectNode.bind(this);
  }

  onSelectNode(node) {
    this.setState({
      selectedNode: node
    });
  }

  render() {
    let { selectedNode } = this.state;
    return [
      <NodeInputs key="NodeInputs" node={selectedNode} />,
      <SvgRenderer onSelectNode={this.onSelectNode} key="SvgRenderer" />,
      <div key="blank" />,
      <ToolBox key="ToolBox" />
    ]
  }
}

