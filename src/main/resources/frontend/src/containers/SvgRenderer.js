import { connect } from 'react-redux';
import SvgRenderer from '../components/svg/SvgRenderer';
import * as actions from '../actions';

const Component = connect(
  state => (
    {
      connections: state.graph.connections,
      nodes: state.graph.nodes,
      selectedNode: state.editor.selectedNode,
      grabbedNodeType: state.editor.grabbedNodeType,
      pan: state.nodeEditor.pan,
      zoom: state.nodeEditor.zoom
    }),
  dispatch => (
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
      grabNodePlaceholder: (nodeType) => {
        dispatch(actions.grabNodePlaceholder(nodeType));
      },
      showToolBox: (show) => {
        dispatch(actions.showToolBox(show));
      }
    }
  )
)(SvgRenderer);

export default Component;
