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
    fetch('api/images')
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {
        dispatch(receiveImages(json));
      });
  };
}

export function fetchSource(id) {
  return (dispatch) => {
    dispatch(requestImages());
    fetch(`api/images/${id}/source`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      ).then(json => {
        dispatch(setGraph(json));
      });
  };
}

/* global FormData, Blob */
export function saveImage(id, source, thumbnail, idChangedCallback) {
  return (dispatch) => {
    dispatch(saveRequest());
    // image with id 0 is 'special'.
    // We never save to that, instead we create a new image
    let url = 'api/images';
    if(id !== 0) {
      url += `/${id}/source`;
    }
    let formData = new FormData();
    formData.append('source', new Blob([JSON.stringify(source)], { type: 'application/json' }));
    formData.append('thumbnail', new Blob([thumbnail], { type: 'text/plain' }));
    fetch(url, {
      method: 'POST',
      body: formData,
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
