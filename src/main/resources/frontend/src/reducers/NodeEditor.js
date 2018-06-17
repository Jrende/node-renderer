let initialState = {
  pan: [0, 0],
  zoom: 1.0,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NODE_EDITOR_VIEW': {
      return {
        ...state,
        pan: action.pan,
        zoom: action.zoom
      };
    }
    default:
      return state;
  }
};
export default appReducer;
