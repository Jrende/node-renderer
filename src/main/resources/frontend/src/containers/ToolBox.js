import { connect } from 'react-redux';
import ToolBox from '../components/ToolBox';

const mapStateToProps = state => (
  {
    types: state.types
  }
);

const Component = connect(
  mapStateToProps
)(ToolBox);

export default Component;
