let initialState = {
  pan: [0, 0],
  zoom: 1.0,
  grabMode: null,
  grabNodeId: -1,
};


const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NODE_EDITOR_VIEW': {
      return Object.assign({}, state, {
        pan: action.pan,
        zoom: action.zoom
      });
    }
    case 'SET_GRAB': {
      return Object.assign({}, state, {
        grabMode: action.grabMode,
        grabNodeId: action.grabNodeId
      });
    }
    case 'STOP_GRAB': {
      return Object.assign({}, state, {
        grabMode: null,
        grabNodeId: -1
      });
    }
    default:
      return state;
  }
};
export default appReducer;
