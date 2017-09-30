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
      type: {
        id: 0,
        name: "Output",
        input: {
          finalResult: "FrameBuffer"
        },
        output: {}
      }
    }
  ]
}
const nodes = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_NODE": {
      let newNode = Object.assign({}, action.node, {id: action.id})
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
    default:
  }
  return state;
}

export default nodes
