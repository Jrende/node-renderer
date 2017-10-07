import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./ToolBox.less"
import draggable from '../utils/DragDrop.js';


class ToolBox extends React.Component {
  constructor(props) {
    super(props);
  }

  enableDraggable(element, type) {
    console.log("enable draggable");
    if(element != undefined) {
      draggable(element, {type});
    }
  }

  render() {
    let { types } = this.props;

    let nodes = types.map(type => {
      return (
        <div className="type" key={type.id} ref={(ref) => this.enableDraggable(ref, type)} >
          <div className="anfang">⁞</div>
          <p>{type.name}</p>
        </div>
      )
    });
    return (
      <div className="tool-box">
      {nodes}
      </div>
    );
  }
}

ToolBox.propTypes = {
  types: PropTypes.array.isRequired
}

export default ToolBox;
