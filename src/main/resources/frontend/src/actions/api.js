
function requestImages() {
  return {
    type: "REQUEST_IMAGES"
  };
}

function receiveImages(images) {
  return {
    type: "RECEIVE_IMAGES",
    images
  };
}

function setGraph(graph) {
  return {
    type: "SET_GRAPH",
    graph
  };
}

export function fetchImages() {
  return function(dispatch) {
    dispatch(requestImages());
    fetch(`http://localhost:8080/api/images`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {
        dispatch(receiveImages(json));
      }
      );
  };
}

export function fetchSource(id) {
  return function(dispatch) {
    dispatch(requestImages());
    fetch(`http://localhost:8080/api/images/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {
        dispatch(setGraph(json));
      });
  };
}
