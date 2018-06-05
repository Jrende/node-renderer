let initialState = {
  selectedNode: -1,
};


const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_NODE': {
      return Object.assign({}, state, {
        selectedNode: action.id
      });
    }
    default:
      return state;
  }
};
export default appReducer;
