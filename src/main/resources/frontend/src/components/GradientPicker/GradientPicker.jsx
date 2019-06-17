import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import './GradientPicker.less';
import GradientInput from '../node/inputs/GradientInput'

let root = document.querySelector('#root');
class GradientPicker extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			element: undefined
		};
		this.setElement = this.setElement.bind(this);
		this.onChange = this.onChange.bind(this);
		this.hideColorpicker = this.hideColorpicker.bind(this);
  }

	setElement(element) {
		this.setState({ element });
	}

  componentDidMount() {
		root.addEventListener('click', this.hideColorpicker);;
  }

	hideColorpicker(event) {
		let elements = document.elementsFromPoint(event.clientX, event.clientY);
		if(!elements.find(elm => elm === this.state.element)) {
			this.props.hideColorpicker();
		}
	}

  componentWillUnmount() {
		root.removeEventListener('click', this.hideColorpicker);;
	}

	onChange(newValue) {
		let node = this.props.colorpicker.editingNode;
		this.props.changeValue(node.id, {
			[node.fieldName]: newValue
		});
	}

  render() {
		let c = this.props.colorpicker;
		let node = c.editingNode;
		let style = {
			left: 0,
			top: 0
		}
		if(this.state.element !== undefined) {
			let box = this.state.element.getBoundingClientRect();
			style = {
				left: c.pos[0] - box.width,
				top: c.pos[1] - box.height
			}
		}
    return (
			<div ref={this.setElement} style={style} className="color-picker">
				<GradientInput value={c.value} onChange={this.onChange} />
			</div>
    );
  }
}

const Component = connect(
	state => ({
		colorpicker: state.editor.colorpicker
	}),
	dispatch => ({
    changeValue: (nodeId, value) => {
      dispatch(actions.changeValue(nodeId, value));
    },
    hideColorpicker: (nodeId, value) => {
      dispatch(actions.hideColorpicker());
    },
	})
)(GradientPicker);

export default Component;
