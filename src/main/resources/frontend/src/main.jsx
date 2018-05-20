import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import Editor from './containers/Editor';

let store = createStore(reducer, applyMiddleware(thunk));

render(
  (
    <Provider store={store}>
      <Editor />
    </Provider>
  ),
  document.getElementById('root')
);
