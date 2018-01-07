import { combineReducers } from 'redux';
import graph from './graph';
import types from './types';

const reducer = combineReducers({
  graph,
  types
});

export default reducer;
