import { connect } from 'react-redux';
import Overview from '../../components/Overview';
import { fetchImages } from '../../actions/api';

const mapStateToProps = state => (
  {
    images: state.images.images
  }
);

const mapDispatchToProps = dispatch => (
  {
    fetchImages: node => {
      dispatch(fetchImages(node));
    }
  }
);

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);

export default Component;
