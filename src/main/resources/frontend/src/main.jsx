import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import thunk from 'redux-thunk';

import reducer from './reducers';
import App from './components/App';

let store = createStore(reducer, applyMiddleware(thunk));

render(
  (<Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>),
  document.getElementById('root')
);
