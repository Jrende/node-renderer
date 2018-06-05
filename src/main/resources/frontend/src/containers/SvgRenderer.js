import { connect } from 'react-redux';
import SvgRenderer from '../components/svg/SvgRenderer';
import * as actions from '../actions';

const mapStateToProps = state => (
  {
    connections: state.graph.connections,
    nodes: state.graph.nodes,
    selectedNode: state.editor.selectedNode,
    pan: state.nodeEditor.pan,
    zoom: state.nodeEditor.zoom,
    grabMode: state.nodeEditor.grabMode,
    grabNodeId: state.nodeEditor.grabNodeId,
  }
);

const mapDispatchToProps = dispatch => (
  {
    createNewNode: node => {
      dispatch(actions.createNewNode(node));
    },
    setNodeLocation: (id, pos) => {
      dispatch(actions.moveNode(id, pos));
    },
    connectNodes: (from, to) => {
      dispatch(actions.connectNodes(from, to));
    },
    removeConnection: (nodeId, connectionName) => {
      dispatch(actions.removeConnection(nodeId, connectionName));
    },
    removeNode: (nodeId) => {
      dispatch(actions.removeNode(nodeId));
    },
    selectNode: (nodeId) => {
      dispatch(actions.selectNode(nodeId));
    },
    setNodeEditorView: (pan, zoom) => {
      dispatch(actions.setNodeEditorView(pan, zoom));
    },
    setGrab: (grabMode, grabNodeId) => {
      dispatch(actions.setGrab(grabMode, grabNodeId));
    },
    stopGrab: () => {
      dispatch(actions.stopGrab());
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRenderer);

export default Component;
