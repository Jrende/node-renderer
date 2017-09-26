let nodeId = 1;
export function createNewNode(node) {
  return {
    type: "CREATE_NODE",
    node,
    id: nodeId++
  }
}

export function moveNode(id, pos) {
  return {
    type: "MOVE_NODE",
    id,
    pos
  }
}

export function connectNodes(from, to) {
  return {
    type: "CONNECT_NODES",
    from,
    to
  }
}
