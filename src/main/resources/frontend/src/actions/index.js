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

export function removeConnection(from, to) {
  return {
    type: 'REMOVE_CONNECTION',
    from,
    to
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

export function setNodeEditorView(pan, zoom) {
  return {
    type: 'SET_NODE_EDITOR_VIEW',
    pan,
    zoom
  };
}

export function grabNodePlaceholder(nodeType) {
  return {
    type: 'GRAB_NODE_PLACEHOLDER',
    nodeType
  };
}

export function showToolBox(show) {
  return {
    type: 'SET_TOOLBOX_VISIBILITY',
    showToolBox: show
  };
}

export function showColorpicker(nodeId, fieldName, value, pos) {
  return {
    type: 'SHOW_COLORPICKER',
		value,
    pos,
		editingNode: {
			id: nodeId,
			fieldName: fieldName
		}
  };
}

export function hideColorpicker() {
  return {
    type: 'HIDE_COLORPICKER',
	}
}

export function showGradientPicker(nodeId, fieldName, value, pos) {
  return {
    type: 'SHOW_GRADIENTPICKER',
		value,
    pos,
		editingNode: {
			id: nodeId,
			fieldName: fieldName
		}
  };
}

export function hideGradientPicker() {
  return {
    type: 'HIDE_GRADIENTPICKER',
	}
}
