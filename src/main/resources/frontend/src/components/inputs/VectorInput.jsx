import React from 'react';
import PropTypes from 'prop-types';
import './VectorInput.less';

function round(num, n) {
  return Math.round( num * n) / n
}
class VectorInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
  }

  render() {
    let { name, type, value } = this.props;
    let typeName = name;

    if(type.name !== undefined) {
      typeName = name;
    }
    return (
      <div className="vector-input">
      </div>
    );
  }
}

VectorInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default VectorInput;
