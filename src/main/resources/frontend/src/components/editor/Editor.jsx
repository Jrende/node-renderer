import React from 'react';
import PropTypes from 'prop-types';

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
        <NodeInputs key="NodeInputs" />
        <SvgRenderer key="SvgRenderer" />
        <ToolBox key="ToolBox" />
        <RenderCanvas key="RenderCanvas" />
      </div>
    );
  }
}


Editor.propTypes = {
  fetchSource: PropTypes.func
};
export default Editor;
