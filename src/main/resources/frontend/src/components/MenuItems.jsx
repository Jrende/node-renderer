import React from 'react';
import PropTypes from 'prop-types';

function getImg(width, height) {
  let canvas = document.querySelector('canvas.render-canvas');
  let origWidth = canvas.width;
  let origHeight = canvas.height;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  window.renderLastFrame();

  let img = canvas.toDataURL('image/png');

  canvas.width = origWidth;
  canvas.height = origHeight;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  window.renderLastFrame();
  return img;
}

class MenuItems extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }

  /* global history, location */
  onSave() {
    let id = +location.pathname.substr(1);
    // Lets do something very ugly
    let img = getImg(200, 100);
    this.props.saveImage(id, this.props.graph, img, (newId) => {
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
