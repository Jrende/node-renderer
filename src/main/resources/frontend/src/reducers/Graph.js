import Types from '../constants/Types';

let typeValues = Object.values(Types);

let initialState = {
  connections: [],
  nodes: {
    0: {
      id: 0,
      pos: [0, 0],
      values: {
        color: {
          r: 1, g: 1, b: 1, a: 1
        }
      },
      type: Types.solidColor
    }
  }
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
        r: 1,
        g: 0,
        b: 0,
        a: 1
      };
    case 'gradient':
      return [
        {
          color: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
          },
          position: 0.0
        },
        {
          color: {
            r: 1,
            g: 0,
            b: 0,
            a: 1
          },
          position: 0.5
        },
        {
          color: {
            r: 1,
            g: 1,
            b: 1,
            a: 1
          },
          position: 1.0
        }
      ];
    case 'enum':
      return value.values[0];
    default:
      return null;
  }
}

function getNewId(nodes) {
  let ids = Object.keys(nodes).sort((a, b) => a - b);
  let newId = +ids[ids.length - 1] + 1;
  return newId;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_NODE': {
      let type = typeValues.find(t => t.id === action.node.type);
      let id = getNewId(state.nodes);

      let newNode = {
        id,
        type,
        pos: action.node.pos,
        values: {}
      };
      if(newNode.type.values !== undefined) {
        Object.keys(newNode.type.values).forEach(key => {
          newNode.values[key] = getDefault(newNode.type.values[key]);
        });
      }

      return {
        ...state,
        nodes: Object.assign({}, state.nodes, {
          [id]: newNode
        })
      };
    }
    case 'MOVE_NODE': {
      return {
        ...state,
        nodes: Object.assign({}, state.nodes, {
          [action.id]: {
            ...state.nodes[action.id],
            pos: action.pos
          }
        })
      };
    }
    case 'CONNECT_NODES': {
      return {
        ...state,
        connections: [
          ...state.connections,
          {
            to: action.to,
            from: action.from
          }
        ]
      };
    }
    case 'REMOVE_CONNECTION': {
      return {
        ...state,
        connections: state.connections.filter(connection =>
          connection.from !== action.from &&
          connection.to !== action.to
        )
      };
    }
    case 'REMOVE_NODE': {
      let newNodes = {
        ...state.nodes
      };
      delete newNodes[action.id];
      let newConnections = state.connections
        .filter(connection => connection.from.id !== action.id && connection.to.id !== action.id);
      return {
        ...state,
        nodes: newNodes,
        connections: newConnections
      };
    }
    case 'CHANGE_VALUE': {
      let node = state.nodes[action.id];
      return {
        ...state,
        nodes: Object.assign({}, state.nodes, {
          [action.id]: {
            ...node,
            values: {
              ...node.values,
              ...action.value
            }
          }
        })
      };
    }
    case 'SET_GRAPH': {
      return {
        ...state,
        selectedNode: -1,
        nodes: action.graph.nodes,
        connections: action.graph.connections
      };
    }
    case 'LOAD_EMPTY_GRAPH': {
      return initialState;
    }
    default:
  }
  return state;
};
