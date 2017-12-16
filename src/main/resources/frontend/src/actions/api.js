import { setGraph } from './index';

function requestImages() {
  return {
    type: 'REQUEST_IMAGES'
  };
}

function receiveImages(images) {
  return {
    type: 'RECEIVE_IMAGES',
    images
  };
}

function saveRequest() {
  return {
    type: 'SAVE_REQUEST'
  };
}

function saveResponse() {
  return {
    type: 'SAVE_RESPONSE'
  };
}

export function fetchImages() {
  return (dispatch) => {
    dispatch(requestImages());
    fetch('/api/images')
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
  return (dispatch) => {
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

export function saveImage(id, graph, idChangedCallback) {
  let newGraph = JSON.parse(JSON.stringify(graph));
  newGraph.forEach(node => {
    Object.keys(node.input).forEach(key => {
      if(node.input[key].node !== undefined) {
        delete node.input[key].node;
      }
    });
  });
  return (dispatch) => {
    dispatch(saveRequest());

    // image with id 0 is "special".
    // We never save to that, instead we create a new image
    let url = '/api/images';
    if(id !== 0) {
      url += `/${id}/source`;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(newGraph),
      credentials: 'include'
    }).then(
      response => {
        if(!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      },
      error => console.log('An error occurred.', error)
    ).then(newId => {
      if(newId !== id) {
        idChangedCallback(newId);
      }
      dispatch(saveResponse());
    });
  };
}
