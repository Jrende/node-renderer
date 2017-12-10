import { combineReducers } from 'redux';
import nodes from './nodes';
import types from './types';
import images from './images';

const reducer = combineReducers({
  nodes,
  images,
  types
});

export default reducer;
