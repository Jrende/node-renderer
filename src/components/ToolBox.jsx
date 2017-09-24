import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./ToolBox.less"


class ToolBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleDragStart = this.handleDragStart.bind(this);
  }

  handleDragStart(event, type) {
    event.dataTransfer.setData("text/plain", JSON.stringify(type));
  }

  render() {
    let { types } = this.props;

    let nodes = types.map(type => {
      return (
        <div key={type.id} className="node" draggable="true" onDragStart={(e) => this.handleDragStart(e, type)}>
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
