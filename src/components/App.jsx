import React from 'react'
import SvgRenderer from '../containers/SvgRenderer'
import ToolBox from '../containers/ToolBox'
import './App.less';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listenToInput: false
    }
  }

  render() {
    return [
      <SvgRenderer key="a" />,
      <div key="b" />,
      <ToolBox key="c" />
    ]
  }
}

