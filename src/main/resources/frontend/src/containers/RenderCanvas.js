import { connect } from 'react-redux';
import RenderCanvas from '../components/RenderCanvas';

const mapStateToProps = state => (
  {
    rootNode: state.nodes.graph.find(node => node.id === 0)
  }
);

const Component = connect(
  mapStateToProps
)(RenderCanvas);

export default Component;
