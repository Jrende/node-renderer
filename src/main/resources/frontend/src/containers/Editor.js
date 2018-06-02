import { connect } from 'react-redux';
import Editor from '../components/Editor';
import * as actions from '../actions';

const mapStateToProps = state => (
  {
    selectedNode: state.app.selectedNode,
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
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);

export default Component;
