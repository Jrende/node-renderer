import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SvgRenderer from '../../containers/editor/SvgRenderer';
import ToolBox from '../../containers/editor/ToolBox';
import NodeInputs from '../../containers/editor/NodeInputs';
import RenderCanvas from '../../containers/editor/RenderCanvas';
import fetchSource from '../../actions/api';
import './Editor.less';

class Editor extends React.Component {
  componentDidMount() {
    let id = this.props.match.params.id;
    if(id !== undefined) {
      this.props.fetchSource(id);
    }
  }

  render() {
    return (
      <div className="editor">
        <nav className="menu-bar">
          <Link to="/">←</Link>
          <button>save</button>
        </nav>
        <div className="node-inputs">
          <NodeInputs key="NodeInputs" />
        </div>
        <div className="svg-renderer">
          <SvgRenderer key="SvgRenderer" />
        </div>
        <div className="tool-box">
          <ToolBox key="ToolBox" />
        </div>
        <div className="canvas">
          <RenderCanvas key="RenderCanvas" />
        </div>
      </div>
    );
  }
}


Editor.propTypes = {
  fetchSource: PropTypes.func
};
export default Editor;
