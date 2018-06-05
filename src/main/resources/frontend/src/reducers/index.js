import { combineReducers } from 'redux';
import graph from './Graph';
import types from './Types';
import editor from './Editor';
import nodeEditor from './NodeEditor';

const reducer = combineReducers({
  graph,
  types,
  nodeEditor,
  editor
});

export default reducer;
