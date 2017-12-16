import { connect } from 'react-redux';
import MenuItems from '../components/MenuItems';
import { saveImage } from '../actions/api';

const mapStateToProps = state => (
  {
    graph: state.nodes.graph
  }
);

const mapDispatchToProps = dispatch => (
  {
    saveImage: (imageId, graph, idChangedCallback) => {
      dispatch(saveImage(imageId, graph, idChangedCallback));
    },
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuItems);

export default Component;