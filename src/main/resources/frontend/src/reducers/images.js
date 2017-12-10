let initialState = {
  images: [],
  isLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "REQUEST_IMAGES": {
      return {
        isLoading: true,
        images: state.images
      };
    }
    case "RECEIVE_IMAGES": {
      return {
        images: action.images,
        isLoading: false
      };
    }
    default:
  }
  return state;
};

export default reducer;
