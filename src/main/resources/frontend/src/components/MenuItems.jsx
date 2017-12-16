import React from 'react';
import PropTypes from 'prop-types';

/*
function get_img( width, height ) {
  canvas.width = width;
  canvas.height = height;
  parameters.screenWidth = width;
  parameters.screenHeight = height;

  gl.viewport( 0, 0, width, height );
  createRenderTargets();
  resetSurface();

  render();

  img=canvas.toDataURL('image/png');

  onWindowResize();

  return img;
}
*/

class MenuItems extends React.Component {
  constructor(props) {
    super(props);
    // Lets do something very ugly
    let canvas = document.querySelector('canvas.render-canvas');
    this.onSave = this.onSave.bind(this);
  }

  /* global history, location */
  onSave() {
    let id = +location.pathname.substr(1);
    this.props.saveImage(id, this.props.graph, (newId) => {
      // Possibly the wrong place to mess around with history
      history.replaceState({}, '?', `/${newId}`);
    });
  }

  render() {
    return [
      <a href="/" key="Back button">Back</a>,
      <button onClick={this.onSave} key="Save Image">Save image</button>
    ];
  }
}

MenuItems.propTypes = {
  saveImage: PropTypes.func.isRequired,
  graph: PropTypes.array.isRequired
};

export default MenuItems;
