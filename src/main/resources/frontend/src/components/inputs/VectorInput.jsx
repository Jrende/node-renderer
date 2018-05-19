import React from 'react';
import PropTypes from 'prop-types';
import './VectorInput.less';

function round(num, n2) {
  let n = Math.pow(10, n2);
  return Math.round( num * n) / n;
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
        <div>
          <span>{round(value[0][0], 3)}</span>,<span>{round(value[0][1], 3)}</span>
        </div>
        <div>
          <span>{round(value[1][0], 3)}</span>,<span>{round(value[1][1], 3)}</span>
        </div>
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
