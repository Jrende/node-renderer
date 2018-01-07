import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { loadEmptyGraph, setGraph } from '../actions';

const mapStateToProps = state => (
  {
    selectedNode: state.graph.selectedNode
  }
);

const mapDispatchToProps = dispatch => (
  {
    setGraph: (graph) => {
      dispatch(setGraph(graph));
    },
    loadEmptyGraph: () => {
      dispatch(loadEmptyGraph());
    },
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);

export default Component;
