let initialState = {
  selectedNode: -1,
  grabbedNodeType: null,
  showToolBox: false,
	gradientPicker: {
		isVisible: false,
		value: undefined,
		pos: [0, 0],
		editingNode: {
			id: -1,
			fieldName: ''
		}
	},
	colorpicker: {
		isVisible: false,
		value: undefined,
		pos: [0, 0],
		editingNode: {
			id: -1,
			fieldName: ''
		}
	}
};


const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      return {
        ...state,
        selectedNode: action.id
      };
    case 'GRAB_NODE_PLACEHOLDER':
      return {
        ...state,
        grabbedNodeType: action.nodeType
      };
    case 'SET_TOOLBOX_VISIBILITY':
      return {
        ...state,
        showToolBox: action.showToolBox
      };
		case 'SHOW_COLORPICKER':
			return {
				...state,
				colorpicker: {
					isVisible: true,
					...action
				}
			}
		case 'HIDE_COLORPICKER':
			return {
				...state,
				colorpicker: {
					isVisible: false,
					pos: [0, 0],
					value: undefined,
					editingNode: {
						id: -1,
						fieldName: ''
					}
				}
			}
		case 'SHOW_GRADIENTPICKER':
			return {
				...state,
				gradientPicker: {
					isVisible: true,
					...action
				}
			}
		case 'HIDE_GRADIENTPICKER':
			return {
				...state,
				gradientPicker: {
					isVisible: false,
					pos: [0, 0],
					value: undefined,
					editingNode: {
						id: -1,
						fieldName: ''
					}
				}
			}
		default:
			return state;
	}
};
export default appReducer;
