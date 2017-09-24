//TODO: Fix naming
//Need better name than "node"
/*
let initialState = {
  nodes: [
    {
      id: 0,
      pos: [0, 60],
      name: "output",
      data: null,
      type: null
    },
    {
      id: 1,
      pos: [0, 25],
      name: "mix",
      data: {
        factor: 0.5
      },
      type: null
    },
    {
      id: 2,
      pos: [-25, 0],
      name: "blur",
      data: {
        radius: 1.0
      },
      type: null
    },
    {
      id: 3,
      pos: [0, -25],
      name: "checker",
      data: null,
      type: null
    },
    {
      id: 4,
      pos: [-50, -25],
      name: "checker-1",
      data: null,
      type: null
    },
    {
      id: 5,
      pos: [-50, 25],
      name: "checker2",
      data: null,
      type: null
    }
  ],
  graph: [
    {
      id: 0,
      input: {
        in: {
          id: 1,
          input: {
            left: {
              id: 3
            },
            right: {
              id: 2,
              input: {
                in: {
                  id: 3,
                }
              }
            }
          }
        }
      }
    },
    {
      id: 4,
      input: {
        in: {
          id: 5
        }
      }
    }
  ]
}
*/

//TODO: Read on how to init between reducers properly
let initialState = {
  graph: [
    {
      id: 0,
      pos: [0, 0],
      type: {
        id: 6,
        name: "Output",
        input: {
          finalResult: "FrameBuffer"
        }
      }
    }
  ]
}

function replaceNode(graph, node) {
  let ret = [];
  for(let i = 0; i < graph.length; i++) {
    let item = findNodeRecursive(graph[i], node.id);
    if(item != null) {
      let newGraph = Object.assign({}, item, node);
      ret.push(newGraph);
    } else {
      ret.push(graph[i]);
    }
  }
  return ret;
}

function findNodeRecursive(graph, id) {
  if(graph.id === id) {
    return graph;
  }
  if(graph.input == null) {
    return null;
  }
  let children = Object.keys(graph.input);
  for(let i = 0; i < children.length; i++) {
    let item = findNodeRecursive(graph.input[children[i]], id);
    if(item != null) {
      return {
        input: {
          [children[i]]: item
        }
      }
    }
  }
  return null;
}

const nodes = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_NODE": {
      let newNode = Object.assign({}, action.node, {id: action.id})
      return {
        graph: [...state.graph, newNode]
      }
      break;
    }
    case "MOVE_NODE": {
      let newGraph = replaceNode(state.graph, {id: action.id, pos: action.pos});
      return {
        graph: newGraph
      }
      break;
    }
    default:
  }
  return state;
}

export default nodes
