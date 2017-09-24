import React from 'react'
import SvgRenderer from '../containers/SvgRenderer'
import ToolBox from '../containers/ToolBox'
import './App.less';

const App = () => (
    <div className="app">
      <SvgRenderer />
      <ToolBox />
    </div>
)

export default App
