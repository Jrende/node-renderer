import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Overview extends React.Component {

  componentDidMount() {
    this.props.fetchImages();
  }

  render() {
    let images = this.props.images.map(img => 
        <li key={`${img}`}>
          <Link to={`/${img}`}>image</Link>
        </li>);
    return (
      <div>
        <h1>This is the Overview.</h1>
        <ul>
          { images }
        </ul>
      </div>
    );
  }
}

Overview.propTypes = {
  images: PropTypes.array.isRequired,
  fetchImages: PropTypes.func
};

export default Overview;
