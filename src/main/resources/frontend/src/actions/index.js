export function createNewNode(node) {
  return {
    type: 'CREATE_NODE',
    node
  };
}

export function moveNode(id, pos) {
  return {
    type: 'MOVE_NODE',
    id,
    pos
  };
}

export function connectNodes(from, to) {
  return {
    type: 'CONNECT_NODES',
    from,
    to
  };
}

export function removeConnection(nodeId, connectionName) {
  return {
    type: 'REMOVE_CONNECTION',
    id: nodeId,
    connectionName
  };
}

export function removeNode(nodeId) {
  return {
    type: 'REMOVE_NODE',
    id: nodeId,
  };
}

export function changeValue(nodeId, value) {
  return {
    type: 'CHANGE_VALUE',
    id: nodeId,
    value
  };
}

export function selectNode(nodeId) {
  return {
    type: 'SELECT_NODE',
    id: nodeId,
  };
}

export function loadEmptyGraph() {
  return {
    type: 'LOAD_EMPTY_GRAPH'
  };
}

export function setGraph(graph) {
  return {
    type: 'SET_GRAPH',
    graph
  };
}
