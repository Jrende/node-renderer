import { combineReducers } from 'redux';
import graph from './Graph';
import editor from './Editor';
import nodeEditor from './NodeEditor';

const reducer = combineReducers({
  graph,
  nodeEditor,
  editor
});

export default reducer;
