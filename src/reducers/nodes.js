//TODO: Read on how to init between reducers properly
let initialState = {
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
}

function getDefault(value) {
  if(value.default !== undefined) {
    return value.default;
  }

  switch(value.type) {
    case "number":
      return 0;
    case "color":
      return "Black";
    default:
      return null;
  }
}

const nodes = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_NODE": {
      let newNode = Object.assign({}, action.node, {
        id: action.id,
        input: {},
        values: {}
      })
      Object.keys(newNode.type.values).forEach(key => {
        newNode.values[key] = getDefault(newNode.type.values[key]);
      });
      return {
        graph: [...state.graph, newNode]
      }
    }
    case "MOVE_NODE": {
      let newGraph = [];
      state.graph.forEach(node => {
        if(node.id === action.id) {
          node = Object.assign({}, node, {pos: action.pos});
        }
        newGraph.push(node);
      });
      return {
        graph: newGraph
      }
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
      return {
        graph: newGraph
      }
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
      return {
        graph: newGraph
      }
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
            return node.output[key].id === action.id
          });
          let inputs = Object.keys(node.input);
          inputs = inputs.filter(key => {
            return node.input[key].id === action.id
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
      return {
        graph: newGraph
      }
    }
    case "CHANGE_VALUE": {
      let newGraph = state.graph
        .map(node => {
          if(node.id === action.id) {
            node = JSON.parse(JSON.stringify(node));
            Object.assign(node.values, action.value);
          }
          return node;
        });
      return {
        graph: newGraph
      }
    }
    default:
  }
  return state;
}

export default nodes
