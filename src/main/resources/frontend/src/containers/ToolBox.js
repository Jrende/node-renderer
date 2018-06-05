import { connect } from 'react-redux';
import ToolBox from '../components/ToolBox';
import * as actions from '../actions';

const mapStateToProps = state => (
  {
    types: state.types,
  }
);

const mapDispatchToProps = dispatch => (
  {
    createNewNode: node => {
      dispatch(actions.createNewNode(node));
    }
  }
);

const Component = connect(mapStateToProps, mapDispatchToProps)(ToolBox);

export default Component;
