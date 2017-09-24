import { combineReducers } from 'redux'
import nodes from './nodes'
import types from './types'

const app = combineReducers({
  nodes,
  types
})

export default app
