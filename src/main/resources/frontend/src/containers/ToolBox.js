import { connect } from 'react-redux';
import ToolBox from '../components/ToolBox';
import * as actions from '../actions';

const mapDispatchToProps = dispatch => (
  {
    createNewNode: node => {
      dispatch(actions.createNewNode(node));
    }
  }
);

const Component = connect(mapDispatchToProps)(ToolBox);

export default Component;
