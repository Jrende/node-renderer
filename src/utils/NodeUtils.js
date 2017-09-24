export function findNode(graph, nodeId) {
  for(let i = 0; i < graph.length; i++) {
    let item = findNodeRecursive(graph[i], nodeId);
    if(item != null) {
      return item;
    }
  }
  return null;
}

export function findNodeRecursive(graph, nodeId) {
  if(graph.id === nodeId) {
    return graph;
  }
  if(graph.input == null) {
    return null;
  }
  let children = Object.keys(graph.input);
  for(let i = 0; i < children.length; i++) {
    let item = findNode(graph.input[children[i]], nodeId);
    if(item != null) {
      return item;
    }
  }
  return null;
}
