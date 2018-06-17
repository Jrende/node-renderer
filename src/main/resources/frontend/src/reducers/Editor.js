let initialState = {
  selectedNode: -1,
  grabbedNodeType: null,
  showToolBox: false
};


const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE':
      return {
        ...state,
        selectedNode: action.id
      };
    case 'GRAB_NODE_PLACEHOLDER': {
      return {
        ...state,
        grabbedNodeType: action.nodeType
      };
    }
    case 'SET_TOOLBOX_VISIBILITY': {
      return {
        ...state,
        showToolBox: action.showToolBox
      };
    }
    default:
      return state;
  }
};
export default appReducer;
