import { combineReducers } from 'redux';
import graph from './graph';
import types from './types';
import app from './app';

const reducer = combineReducers({
  graph,
  types,
  app
});

export default reducer;
