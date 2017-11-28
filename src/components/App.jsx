import React from 'react';
import SvgRenderer from '../containers/SvgRenderer';
import ToolBox from '../containers/ToolBox';
import NodeInputs from '../containers/NodeInputs';
import RenderCanvas from '../containers/RenderCanvas';
import './App.less';

export default class App extends React.Component {
  render() {
    return [
      <NodeInputs key="NodeInputs" />,
      <SvgRenderer key="SvgRenderer" />,
      <ToolBox key="ToolBox" />,
      <RenderCanvas key="RenderCanvas" />
    ];
  }
}

