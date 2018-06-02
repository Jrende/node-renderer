import React from 'react';
import PropTypes from 'prop-types';
import './ToolBox.less';

let root = document.querySelector('#root');
class ToolBox extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { types } = this.props;

    let nodes = Object.keys(types)
      .map(key => types[key])
      .filter(type => type.id !== 0)
      .map(type =>
        (
          <div className="type" key={type.id}>
            <div className="anfang">⁞</div>
            <p>{type.name}</p>
          </div>
        ));
    return nodes;
  }
}

ToolBox.propTypes = {
  types: PropTypes.object.isRequired,
};

export default ToolBox;
