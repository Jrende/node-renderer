import { combineReducers } from 'redux';
import nodes from './nodes';
import types from './types';

const reducer = combineReducers({
  nodes,
  types
});

export default reducer;
