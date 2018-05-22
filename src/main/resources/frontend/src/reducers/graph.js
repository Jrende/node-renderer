import { types } from './types';

let typeValues = Object.values(types);

let initialState = {
  selectedNode: -1,
  connections: [],
  nodes: [{
    pos: [0, 0],
    values: {},
    type: types.finalOutput
  }]
};

/*
let initialState = JSON.parse("{\"selectedNode\":1,\"connections\":[{\"to\":{\"id\":0,\"name\":\"finalResult\"},\"from\":{\"id\":1,\"name\":\"out\"}}],\"nodes\":[{\"pos\":[0,0],\"values\":{},\"type\":{\"id\":0,\"name\":\"Output\",\"input\":{\"finalResult\":{\"type\":\"FrameBuffer\",\"name\":\"Final result\"}},\"output\":{},\"values\":{}}},{\"type\":{\"id\":6,\"name\":\"Gradient\",\"values\":{\"gradient\":{\"name\":\"Gradient\",\"type\":\"gradient\"},\"repeat\":{\"name\":\"Repeat mode\",\"type\":\"enum\",\"values\":[\"Repeat\",\"Mirrored repeat\",\"Clamp to edge\"]},\"vector\":{\"name\":\"Direction\",\"type\":\"vector\",\"default\":[[0,0],[1,0]]}},\"output\":{\"out\":{\"type\":\"FrameBuffer\",\"name\":\"Output\"}}},\"pos\":[-164.833251953125,14.5],\"values\":{\"gradient\":[{\"color\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1},\"position\":0},{\"color\":{\"r\":1,\"g\":0,\"b\":0,\"a\":1},\"position\":0.5},{\"color\":{\"r\":1,\"g\":1,\"b\":1,\"a\":1},\"position\":1}],\"repeat\":\"Repeat\",\"vector\":[[0,0],[1,0]]}}]}");
*/

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

const nodes = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_NODE': {
      let type = typeValues.find(t => t.id === action.node.type);
      let id = getNewId(state.nodes);

      let newNode = Object.assign({}, {
        type,
        pos: action.node.pos,
        values: {}
      });
      if(newNode.type.values !== undefined) {
        Object.keys(newNode.type.values).forEach(key => {
          newNode.values[key] = getDefault(newNode.type.values[key]);
        });
      }

      return Object.assign({}, state, {
        nodes: Object.assign([], state.nodes, {
          [id]: newNode
        })
      });
    }
    case 'MOVE_NODE': {
      return Object.assign({}, state, {
        nodes: Object.assign([], state.nodes, {
          [action.id]: Object.assign({}, state.nodes[action.id], {
            pos: action.pos
          })
        })
      });
    }
    case 'CONNECT_NODES': {
      let newConnections = [...state.connections, {
        to: action.to,
        from: action.from
      }];

      return Object.assign({}, state, {
        connections: newConnections
      });
    }
    case 'REMOVE_CONNECTION': {
      let newConnections = state.connections
        .filter(connection =>
          connection.from !== action.from &&
          connection.to !== action.to
        );
      return Object.assign({}, state, {
        connections: newConnections
      });
    }
    case 'REMOVE_NODE': {
      let newNodes = Object.assign([], state.nodes);
      delete newNodes[action.id];
      let newConnections = state.connections
        .filter(connection => connection.from.id !== action.id && connection.to.id !== action.id);
      return Object.assign({}, state, {
        nodes: newNodes,
        connections: newConnections
      });
    }
    case 'CHANGE_VALUE': {
      let node = state.nodes[action.id];
      return Object.assign({}, state, {
        nodes: Object.assign([], state.nodes, {
          [action.id]: Object.assign({}, node, {
            values: Object.assign({}, node.values, action.value)
          })
        })
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
        nodes: action.graph.nodes,
        connections: action.graph.connections
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
