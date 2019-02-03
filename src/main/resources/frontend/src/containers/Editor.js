import { connect } from 'react-redux';
import Editor from '../components/Editor';
import * as actions from '../actions';
import * as api from '../actions/api';

const mapStateToProps = state => (
  {
    selectedNode: state.editor.selectedNode,
    grabbedNodeType: state.editor.grabbedNodeType,
    showToolBox: state.editor.showToolBox
  }
);

const mapDispatchToProps = dispatch => (
  {
    setGraph: (graph) => {
      dispatch(actions.setGraph(graph));
    },
    loadEmptyGraph: () => {
      dispatch(actions.loadEmptyGraph());
    },
    selectNode: (nodeId) => {
      dispatch(actions.selectNode(nodeId));
    },
    fetchGraph: (graphId) => {
      dispatch(api.fetchSource(graphId));
    },
    setToolBoxVisibility: (show) => {
      dispatch(actions.showToolBox(show));
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);

export default Component;
