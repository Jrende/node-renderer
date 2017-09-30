/*
graph: [
  {
    id: 0,
    name: "final output",
    pos: "...",
    input: {
      final: {
	node: 1,
	output: "output"
      }
    }
  },
  {
    id: 1,
    name: "mix",
    pos: "...",
    input: {
      left: {
	node: 2,
	output: "output"
      }
      right: {
	node: 3,
	output: "output"
      }
    }
  },
  {
    id: 2,
    name: "blur",
    input: {
      in: {
	node: 3,
	output: "output"
      }
    }
  },
  {
    id: 3,
    name: "color map",
    input: {
      in: {
	node: 4,
	output: "color"
      }
    }
  },
  {
    id: 4,
    name: "voronoi"
  }
]
 */
//TODO: Read on how to init between reducers properly
let initialState = {
  graph: [
    {
      id: 0,
      pos: [0, 0],
      input: {},
      type: {
        id: 0,
        name: 'Output',
        input: {
          finalResult: {
            type: 'FrameBuffer',
            name: 'Final result'
          },
        },
        output: {}
      }
    }
  ]
}
const nodes = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_NODE": {
      let newNode = Object.assign({}, action.node, {id: action.id, input: {}})
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
    default:
  }
  return state;
}

export default nodes
