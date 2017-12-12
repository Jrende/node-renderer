
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

function startSave() {
  return {
    type: "START_SAVE"
  };
}

function saveSuccessful() {
  return {
    type: "SAVE_SUCCESSFUL"
  };
}

export function fetchImages() {
  return function(dispatch) {
    dispatch(requestImages());
    fetch(`/api/images`)
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
    fetch(`/api/images/${id}/source`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      ).then(json => {
        dispatch(setGraph(json));
      });
  };
}

export function saveImage(id, source) {
  dispatch(startSave());
  fetch(`/api/images/${id}/source`, {
    method: 'POST',
    credentials: 'include'
  }).then(
    response => response.json(),
    error => console.log('An error occurred.', error)
  ).then(json => {
    dispatch(saveSuccessful());
  });
}
