import { connect } from 'react-redux';
import RenderCanvas from '../components/RenderCanvas';
import * as actions from '../actions';

const mapStateToProps = state => (
  {
    id: state.editor.selectedNode,
    nodes: state.graph.nodes,
    connections: state.graph.connections,
    selectedNode: state.graph.nodes[state.editor.selectedNode],
    pan: state.nodeEditor.pan
  }
);

const mapDispatchToProps = dispatch => (
  {
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    },
    selectNode: (nodeId) => {
      dispatch(actions.selectNode(nodeId));
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderCanvas);

export default Component;
