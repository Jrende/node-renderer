import React from 'react'
import SvgRenderer from '../containers/SvgRenderer'
import ToolBox from '../containers/ToolBox'
import NodeInputs from '../containers/NodeInputs'
import './App.less';

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return [
      <NodeInputs key="NodeInputs" />,
      <SvgRenderer key="SvgRenderer" />,
      <div key="blank" />,
      <ToolBox key="ToolBox" />
    ]
  }
}

