import { types } from './types';

let typeValues = Object.values(types);

let initialState = {
  selectedNode: -1,
  graph: [
    {
      id: 0,
      pos: [0, 0],
      input: {},
      values: {},
      type: types.finalOutput
    }
  ]
};

function getDefault(value) {
  if(value.default !== undefined) {
    return value.default;
  }
  switch(value.type) {
    case 'number':
      return 0;
    case 'color':
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      };
    default:
      return null;
  }
}

const nodes = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_NODE': {
      let ids = state.graph.map(n => n.id).sort();
      let newId = ids[ids.length - 1] + 1;
      let type = typeValues.find(t => t.id === action.node.type);

      let newNode = Object.assign({}, {
        id: newId,
        type,
        pos: action.node.pos,
        input: {},
        values: {}
      });
      if(newNode.type.values !== undefined) {
        Object.keys(newNode.type.values).forEach(key => {
          newNode.values[key] = getDefault(newNode.type.values[key]);
        });
      }
      return Object.assign({}, state, {
        graph: [...state.graph, newNode]
      });
    }
    case 'MOVE_NODE': {
      let newGraph = [];
      state.graph.forEach(node => {
        if(node.id === action.id) {
          node = Object.assign({}, node, { pos: action.pos });
        }
        newGraph.push(node);
      });
      let newState = Object.assign({}, state, {
        graph: newGraph
      });
      return newState;
    }
    case 'CONNECT_NODES': {
      let fromNode = state.graph.find(node => node.id === action.from.id);
      let newGraph = state.graph.map(node => {
        if(node.id === action.to.id) {
          return Object.assign({}, node, {
            input: Object.assign({}, node.input, {
              [action.to.name]: {
                node: fromNode,
                name: action.from.name
              }
            })
          });
        }
        return node;
      });
      return Object.assign({}, state, {
        graph: newGraph
      });
    }
    case 'REMOVE_CONNECTION': {
      let node = state.graph.find(n => n.id === action.id);
      let newNode = JSON.parse(JSON.stringify(node));
      delete newNode.input[action.connectionName];
      let newGraph = state.graph.map(n => {
        if(n.id === newNode.id) {
          return newNode;
        }
        return n;
      });
      return Object.assign({}, state, {
        graph: newGraph
      });
    }
    case 'REMOVE_NODE': {
      let newGraph = state.graph
        .filter(node => node.id !== action.id)
        .map(node => {
          let outputs = [];
          if(node.output != null) {
            outputs = Object.keys(node.output);
          }
          outputs = outputs.filter(key => node.output[key].node.id === action.id);
          let inputs = Object.keys(node.input);
          inputs = inputs.filter(key => node.input[key].node.id === action.id);
          if(outputs.length > 0 || inputs.length > 0) {
            let newNode = JSON.parse(JSON.stringify(node));
            outputs.forEach(thing => {
              delete newNode.output[thing];
            });
            inputs.forEach(thing => {
              delete newNode.input[thing];
            });
            return newNode;
          }
          return node;
        });
      return Object.assign({}, state, {
        graph: newGraph
      });
    }
    case 'CHANGE_VALUE': {
      let newGraph = state.graph
        .map(node => {
          if(node.id === action.id) {
            let newNode = Object.assign({}, node);
            newNode.values = Object.assign({}, node.values, action.value);
            return newNode;
          }
          return node;
        });
      return Object.assign({}, state, {
        graph: newGraph
      });
    }
    case 'SELECT_NODE': {
      return Object.assign({}, state, {
        selectedNode: action.id
      });
    }
    case 'SET_GRAPH': {
      return Object.assign({}, state, {
        selectedNode: -1,
        graph: action.graph
      });
    }
    case 'LOAD_EMPTY_GRAPH': {
      return initialState;
    }
    default:
  }
  return state;
};

export default nodes;
