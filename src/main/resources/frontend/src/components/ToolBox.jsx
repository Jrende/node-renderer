import React from 'react';
import PropTypes from 'prop-types';
import './ToolBox.less';
import draggable from '../utils/DragDrop';


class ToolBox extends React.Component {
  enableDraggable(element, type) {
    if(element !== undefined) {
      draggable(element, { type });
    }
  }

  render() {
    let { types } = this.props;

    let nodes = Object.keys(types)
      .map(key => types[key])
      .filter(type => type.id !== 0)
      .map(type =>
        (
          <div className="type" key={type.id} ref={(ref) => this.enableDraggable(ref, type)} >
            <div className="anfang">⁞</div>
            <p>{type.name}</p>
          </div>
        ));
    return nodes;
  }
}

ToolBox.propTypes = {
  types: PropTypes.object.isRequired
};

export default ToolBox;
