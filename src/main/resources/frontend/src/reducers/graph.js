import { types } from './types';

let typeValues = Object.values(types);

let initialState = {
  connections: [],
  nodes: [{
    pos: [0, 0],
    values: {},
    type: types.finalOutput
  }]
};

//let initialState = JSON.parse('{"nodes":[{"pos":[0,0],"values":{},"type":{"id":0,"name":"Output","input":{"finalResult":{"type":"FrameBuffer","name":"Final result"}},"output":{},"values":{}}},{"type":{"id":1,"name":"Clouds","values":{"seed":{"name":"Seed","type":"number","default":1},"left":{"name":"Left","type":"number","default":0,"min":-10,"max":10},"size":{"name":"Size","type":"number","default":1},"density":{"name":"Density","type":"number","min":0,"max":1,"default":0.5}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-1082,140.5],"values":{"seed":1,"left":0,"size":"20","density":"0.11"}},{"type":{"id":6,"name":"Gradient","values":{"gradient":{"name":"Gradient","type":"gradient"},"repeat":{"name":"Repeat mode","type":"enum","values":["Repeat","Mirrored repeat","Clamp to edge"]},"vector":{"name":"Direction","type":"vector","default":[[0,0],[1,0]]}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-1137.35,248.5],"values":{"gradient":[{"color":{"r":0,"g":0,"b":0,"a":1},"position":0},{"position":0.22187499999999996,"color":{"r":0,"g":0.9058823529411765,"b":0.6392156862745098,"a":1}},{"color":{"r":1,"g":0,"b":0,"a":1},"position":0.5},{"color":{"r":1,"g":1,"b":1,"a":1},"position":1}],"repeat":"Mirrored repeat","vector":[[0.2587892711162567,-0.03515625],[0.31805941462516785,-0.072265625]]}},{"type":{"id":2,"name":"Blend","values":{"mode":{"name":"Mode","type":"enum","values":["Normal","Screen","Multiply"]},"factor":{"name":"Factor","type":"number","default":0.5,"max":1,"min":0}},"input":{"left":{"type":"FrameBuffer","name":"Left"},"right":{"type":"FrameBuffer","name":"Right"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-914.37,190],"values":{"mode":"Multiply","factor":"1"}},{"type":{"id":6,"name":"Gradient","values":{"gradient":{"name":"Gradient","type":"gradient"},"repeat":{"name":"Repeat mode","type":"enum","values":["Repeat","Mirrored repeat","Clamp to edge"]},"vector":{"name":"Direction","type":"vector","default":[[0,0],[1,0]]}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-872,26.970046997070312],"values":{"gradient":[{"color":{"r":0,"g":0,"b":0,"a":1},"position":0},{"position":0.1625,"color":{"r":0.050980392156862744,"g":1,"b":0.00392156862745098,"a":1}},{"color":{"r":0,"g":0.8705882352941177,"b":1,"a":1},"position":0.4125},{"position":0.7312500000000006,"color":{"r":1,"g":0.796078431372549,"b":0,"a":1}},{"color":{"r":1,"g":1,"b":1,"a":1},"position":1}],"repeat":"Mirrored repeat","vector":[[0.5343623161315918,-0.138671875],[0.4273088276386261,-0.2177734375]]}},{"type":{"id":2,"name":"Blend","values":{"mode":{"name":"Mode","type":"enum","values":["Normal","Screen","Multiply"]},"factor":{"name":"Factor","type":"number","default":0.5,"max":1,"min":0}},"input":{"left":{"type":"FrameBuffer","name":"Left"},"right":{"type":"FrameBuffer","name":"Right"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-690,176],"values":{"mode":"Normal","factor":0.5}},{"type":{"id":1,"name":"Clouds","values":{"seed":{"name":"Seed","type":"number","default":1},"left":{"name":"Left","type":"number","default":0,"min":-10,"max":10},"size":{"name":"Size","type":"number","default":1},"density":{"name":"Density","type":"number","min":0,"max":1,"default":0.5}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-778.32,-21.5],"values":{"seed":1,"left":"2.65","size":"10","density":"0.36"}},{"type":{"id":2,"name":"Blend","values":{"mode":{"name":"Mode","type":"enum","values":["Normal","Screen","Multiply"]},"factor":{"name":"Factor","type":"number","default":0.5,"max":1,"min":0}},"input":{"left":{"type":"FrameBuffer","name":"Left"},"right":{"type":"FrameBuffer","name":"Right"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-529.35,37],"values":{"mode":"Multiply","factor":"1"}},{"type":{"id":4,"name":"Hue/Saturation","values":{"hue":{"name":"Hue","type":"number","default":0,"max":1,"min":-1},"saturation":{"name":"Saturation","type":"number","default":0,"max":1,"min":-1},"lightness":{"name":"Lightness","type":"number","default":0,"max":1,"min":-1}},"input":{"inputTexture":{"type":"FrameBuffer","name":"Input"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-293.37,31.5],"values":{"hue":"0.87","saturation":"0.94","lightness":"0.33"}},{"type":{"id":2,"name":"Blend","values":{"mode":{"name":"Mode","type":"enum","values":["Normal","Screen","Multiply"]},"factor":{"name":"Factor","type":"number","default":0.5,"max":1,"min":0}},"input":{"left":{"type":"FrameBuffer","name":"Left"},"right":{"type":"FrameBuffer","name":"Right"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-163.2988739013672,-94.305419921875],"values":{"mode":"Multiply","factor":"1"}},{"type":{"id":7,"name":"Color Map","values":{"gradient":{"name":"Gradient","type":"gradient"}},"input":{"inputTexture":{"type":"FrameBuffer","name":"Input"}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-593.18310546875,-186.41114807128906],"values":{"gradient":[{"color":{"r":1,"g":1,"b":1,"a":1},"position":0},{"position":0.240625,"color":{"r":0.5490196078431373,"g":0.7529411764705882,"b":0.4392156862745098,"a":1}},{"position":0.5750000000000004,"color":{"r":0.6431372549019608,"g":0,"b":1,"a":1}},{"color":{"r":1,"g":0,"b":0,"a":1},"position":0.8125000000000004},{"color":{"r":0,"g":1,"b":0.611764705882353,"a":1},"position":1}]}},{"type":{"id":1,"name":"Clouds","values":{"seed":{"name":"Seed","type":"number","default":1},"left":{"name":"Left","type":"number","default":0,"min":-10,"max":10},"size":{"name":"Size","type":"number","default":1},"density":{"name":"Density","type":"number","min":0,"max":1,"default":0.5}},"output":{"out":{"type":"FrameBuffer","name":"Output"}}},"pos":[-808.9131198120118,-175.70113220214847],"values":{"seed":1,"left":0,"size":1,"density":0.5}}],"connections":[{"to":{"id":3,"name":"right"},"from":{"id":2,"name":"out"}},{"to":{"id":3,"name":"left"},"from":{"id":1,"name":"out"}},{"to":{"id":5,"name":"left"},"from":{"id":4,"name":"out"}},{"to":{"id":5,"name":"right"},"from":{"id":3,"name":"out"}},{"to":{"id":7,"name":"left"},"from":{"id":6,"name":"out"}},{"to":{"id":7,"name":"right"},"from":{"id":5,"name":"out"}},{"to":{"id":8,"name":"inputTexture"},"from":{"id":7,"name":"out"}},{"to":{"id":9,"name":"right"},"from":{"id":8,"name":"out"}},{"to":{"id":0,"name":"finalResult"},"from":{"id":9,"name":"out"}},{"to":{"id":9,"name":"left"},"from":{"id":10,"name":"out"}},{"to":{"id":10,"name":"inputTexture"},"from":{"id":11,"name":"out"}}]}');


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
