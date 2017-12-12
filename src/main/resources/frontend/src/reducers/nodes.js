//TODO: Read on how to init between reducers properly
let initialState = {
  selectedNode: -1,
  graph: [
    {
      id: 0,
      pos: [0, 0],
      input: {},
      values: {},
      type: {
        id: 0,
        name: 'Output',
        input: {
          finalResult: {
            type: 'FrameBuffer',
            name: 'Final result'
          },
        },
        output: {},
        values: {}
      }
    }
  ]
};

function getDefault(value) {
  if(value.default !== undefined) {
    return value.default;
  }
  switch(value.type) {
    case "number":
      return 0;
    case "color":
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
    case "CREATE_NODE": {
      let ids = state.graph.map(n => n.id).sort();
      let newId = ids[ids.length - 1] + 1;
      let newNode = Object.assign({}, action.node, {
        id: newId,
        input: {},
        values: {}
      });
      if(newNode.type.values !== undefined) {
        Object.keys(newNode.type.values).forEach(key => {
          newNode.values[key] = getDefault(newNode.type.values[key]);
        });
      }
      return Object.assign({}, state, {
        graph: [...state.graph, newNode],
        selectedNode: action.id
      });
    }
    case "MOVE_NODE": {
      let newGraph = [];
      state.graph.forEach(node => {
        if(node.id === action.id) {
          node = Object.assign({}, node, {pos: action.pos});
        }
        newGraph.push(node);
      });
      let newState = Object.assign({}, state, {
        graph: newGraph
      });
      return newState;
    }
    case "CONNECT_NODES": {
      let newGraph = state.graph.map(node => {
        if(node.id === action.to.id) {
          let fromNode = state.graph.find(n => n.id === action.from.id);
          let toNode = state.graph.find(n => n.id === action.to.id);
          return Object.assign({}, node, {
            input: Object.assign({}, node.input, {
              [action.to.name]: {
                id: action.from.id,
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
    case "REMOVE_CONNECTION": {
      let node = state.graph.find(node => node.id === action.id);
      let newNode = JSON.parse(JSON.stringify(node));
      delete newNode.input[action.connectionName];
      let newGraph = state.graph.map(node => {
        if(node.id === newNode.id) {
          return newNode;
        }
        return node;
      });
      return Object.assign({}, state, {
        graph: newGraph
      });
    }
    case "REMOVE_NODE": {
      let newGraph = state.graph
        .filter(node => node.id !== action.id)
        .map(node => {
          let outputs = [];
          if(node.output != null) {
            outputs = Object.keys(node.output);
          }
          outputs = outputs.filter(key => {
            return node.output[key].id === action.id;
          });
          let inputs = Object.keys(node.input);
          inputs = inputs.filter(key => {
            return node.input[key].id === action.id;
          });
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
    case "CHANGE_VALUE": {
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
    case "SELECT_NODE": {
      return Object.assign({}, state, {
        selectedNode: action.id
      });
    }
    case "SET_GRAPH": {
      return {
        selectedNode: -1,
        graph: action.graph
      };
    }
    default:
  }
  return state;
};

export default nodes;
