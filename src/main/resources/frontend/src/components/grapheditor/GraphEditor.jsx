import React from 'react';
import { connect } from 'react-redux';
import { vec2, mat2d } from 'gl-matrix';
import * as actions from '../../actions';
import './GraphEditor.less';
import Node from '../node/Node';
import SvgLineDisplay from './SvgLineDisplay';
import { transformPointToSvgSpace, addInSvgSpace } from '../../utils/SvgUtils';

function getCenter(r) {
  return [
    r.x + (r.width / 2),
    r.y + (r.height / 2)
  ];
}

function getNodeFromTarget(target, htmlNodeCanvas) {
  let parent = target;
  while(parent !== htmlNodeCanvas) {
    if(parent.hasAttribute('data-node-id')) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return undefined;
}

function findConnectorNode(nodeList) {
  for(let i = 0; i < nodeList.length; i++) {
    let e = nodeList[i];
    if(e.classList.contains('io-grab-input') || e.classList.contains('io-grab-output')) {
      return e;
    }
  }
  return null;
}


/* globals SVGSVGElement, document */
class GraphEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabFrom: [0, 0],
      grabConnectorType: undefined,
      grabMode: undefined,
      grabTo: [0, 0],
      grabMoved: false,
      grabbedNode: -1,
      domConnections: [],
      // Maybe shouldn't be in state
      shouldGenerateConnectionsAfterMount: false,
      lastPos: [0, 0],
    };
    this.lastTouchPos = [];

    [
      'handleDrop',
      'setSvg',
      'onDragbarMouseDown',
      'handleTouchMove',
      'handleTouchEnd',
      'handleTouchStart',
      'handleMouseMove',
      'handleMouseUp',
      'handleMouseDown',
      'onConnectorMouseUp',
      'onConnectorMouseDown',
      'onKeyDown',
      'onWheel',
      'setHtmlNodeCanvas',
      'handleNodeTouchStart',
      'handleNodeTouchMove'
    ].forEach(name => { this[name] = this[name].bind(this); });
  }
  //
  // TODO: Fix zoom
  onWheel(event) {
    let deltaY = event.deltaY;
    // Firefox gives scroll in number of lines. We convert that into pixel values matching Chrome
    if(event.deltaMode === 1) {
      deltaY *= 18;
    }
    let zoom = this.props.zoom - deltaY / 200;
    if(zoom > 0) {
      this.props.setNodeEditorView(this.props.pan, zoom);
    }
  }

  onKeyDown(event) {
    if(event.key === 'Delete') {
      if(document.activeElement !== undefined) {
        let activeNodeId = document.activeElement.getAttribute('data-node-id') | 0;
        if(activeNodeId !== 0) {
          this.props.removeNode(activeNodeId);
        }
      }
    }
  }

  handleTouchStart(event) {
    event.stopPropagation();
    event.preventDefault();
    let mid = [0, 0];
    let touches = [];
    for(let i = 0; i < event.touches.length; i++) {
      let t = event.touches[i];
      touches.push([t.clientX, t.clientY]);
      mid[0] += t.clientX;
      mid[1] += t.clientY;
    }
    mid[0] /= event.touches.length;
    mid[1] /= event.touches.length;
    this.lastTouchPos = touches;
    this.grabCanvas(mid);
  }

  handleNodeTouchStart(event) {
    if(event.touches.length === 2) {
      this.handleTouchStart(event);
    }
  }

  handleMouseDown(event) {
    if(event.target === this.htmlNodeCanvas) {
      event.stopPropagation();
      event.preventDefault();
      if(event.pointerId !== undefined) {
        event.target.setPointerCapture(event.pointerId);
      }
      this.grabCanvas([event.clientX, event.clientY]);
    }
  }

  grabCanvas(pos) {
    this.props.selectNode(-1);
    this.setState({
      lastPos: pos,
      grabMode: 'canvas'
    });
  }


  onConnectorMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    if(event.pointerId !== undefined) {
      event.target.setPointerCapture(event.pointerId);
    }
    let t = event.target;

    let connectorName = event.target.getAttribute('data-output-name') || event.target.getAttribute('data-input-name');
    let svgNode = getNodeFromTarget(event.target, this.htmlNodeCanvas);
    let grabbedNode = Number(svgNode.getAttribute('data-node-id'));
    let grabFrom = transformPointToSvgSpace(
      getCenter(t.getBoundingClientRect()),
      this.svg,
      this.point);
    let grabTo = grabFrom;

    let grabConnectorType = event.target.hasAttribute('data-output-name') ? 'output' : 'input';
    if(grabConnectorType === 'input') {
      let existingConnection = this.props.connections.find(c =>
        c.to.id === grabbedNode && c.to.name === connectorName);
      // If there is an existing connection, we want to change that one instead.
      if(existingConnection !== undefined) {
        this.props.removeConnection(existingConnection.from, existingConnection.to);
        grabbedNode = existingConnection.from.id;
        connectorName = existingConnection.from.name;
        grabConnectorType = 'output';
        let toElm = this.htmlNodeCanvas
          .querySelector(`div[data-node-id="${grabbedNode}"] span[data-output-name="${connectorName}"]`);
        grabFrom = transformPointToSvgSpace(
          getCenter(toElm.getBoundingClientRect()),
          this.svg, this.point);
      }
    }
    this.setState({
      connectorName,
      grabMode: 'connector',
      grabbedNode,
      grabConnectorType,
      grabTo,
      grabFrom,
      lastPos: [event.clientX, event.clientY],
    });
  }

  onDragbarMouseDown(event) {
    event.preventDefault();
    let id = event.target.parentElement.getAttribute('data-node-id');
    this.setState({
      lastPos: [event.clientX, event.clientY],
      grabbedNode: id,
      grabMode: 'element'
    });
  }

  handleNodeTouchMove(event) {
    if(event.touches.length === 2) {
      this.handleTouchMove(event);
    }
  }

  handleTouchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    let mid = [0, 0];
    let touches = [];
    for(let i = 0; i < event.touches.length; i++) {
      let t = event.touches[i];
      touches.push([t.clientX, t.clientY]);
      mid[0] += t.clientX;
      mid[1] += t.clientY;
    }
    mid[0] /= event.touches.length;
    mid[1] /= event.touches.length;

    let zoom = this.props.zoom;
    if(touches.length === 2) {
      let preScale = vec2.distance(this.lastTouchPos[0], this.lastTouchPos[1]);
      let postScale = vec2.distance(touches[0], touches[1]);
      zoom *= (postScale / preScale);
    }

    this.onMove(mid, zoom);
    this.lastTouchPos = touches;
  }

  handleMouseMove(event) {
    if(this.state.grabbedNode !== -1 || this.state.grabMode !== undefined) {
      if(event.buttons === 0) {
        this.setState({
          grabbedNode: -1,
          grabMode: undefined
        });
        return;
      }
      event.preventDefault();
      this.onMove([event.clientX, event.clientY], this.props.zoom);
    }
  }

  onMove(pos, zoom) {
    let delta = [
      (pos[0] - this.state.lastPos[0]),
      (pos[1] - this.state.lastPos[1])
    ];
    switch(this.state.grabMode) {
      case 'element': {
        let nodeId = this.state.grabbedNode;
        let node = this.props.nodes[nodeId];
        let newPos = [
          node.pos[0] + delta[0] / zoom,
          node.pos[1] + delta[1] / zoom
        ];
        this.props.setNodeLocation(nodeId, newPos);
      }
        break;
      case 'canvas': {
        let pan = [
          this.props.pan[0] + delta[0] / zoom,
          this.props.pan[1] + delta[1] / zoom
        ];
        this.props.setNodeEditorView(pan, zoom);
      }
        break;
      default:
        break;
    }
    let newState = {
      grabMoved: true,
      lastPos: pos
    };
    if(this.state.grabMode === 'connector') {
      let grabTo = addInSvgSpace(this.state.grabTo, delta, this.svg, this.point);
      newState.grabTo = grabTo;
    }
    this.setState(newState);
  }

  onConnectorMouseUp(target) {
    if(target.hasAttribute('data-input-name') || (target.hasAttribute('data-output-name') && this.state.grabConnectorType !== 'output')) {
      let nodeId = -1;
      let parent = target.parentElement;
      let inputName = target.getAttribute('data-input-name') || target.getAttribute('data-output-name');
      while(!(parent instanceof SVGSVGElement)) {
        if(parent.hasAttribute('data-node-id')) {
          nodeId = parent.getAttribute('data-node-id') | 0;
          break;
        }
        parent = parent.parentElement;
      }
      if(nodeId !== -1 && nodeId !== this.state.grabbedNode && this.state.grabbedNode !== -1) {
        let from = {
          id: this.state.grabbedNode,
          name: this.state.connectorName
        };
        let to = {
          id: nodeId,
          name: inputName
        };
        if(this.state.grabConnectorType === 'input') {
          let temp = to;
          to = from;
          from = temp;
        }
        let existingConnection = this.props.connections.find(c =>
          c.to.id === to.id && c.to.name === to.name);
        if(existingConnection) {
          this.props.removeConnection(existingConnection.from, existingConnection.to);
        }
        this.props.connectNodes(from, to);
      }
    }
  }

  handleMouseUp(event) {
    this.onRelease([event.clientX, event.clientY], event);
  }

  handleTouchEnd(event) {
    let touch = event.changedTouches[0];
    this.onRelease([touch.clientX, touch.clientY], event);
  }

  onRelease(pos, event) {
    let connectorNode = findConnectorNode(document.elementsFromPoint(pos[0], pos[1]));
    if(connectorNode !== null) {
      this.onConnectorMouseUp(connectorNode);
    }
    if(this.props.grabbedNodeType !== null) {
      event.preventDefault();
      let canvasRect = event.target.getBoundingClientRect();
      this.handleDrop(pos, canvasRect);
    }
    this.cancelGrab();
  }

  cancelGrab() {
    this.setState({
      grabbedNode: -1
    });
    this.setState({
      grabMoved: false,
      grabMode: undefined
    });
  }
  setSvg(svg) {
    if(svg !== undefined && svg !== null) {
      this.svg = svg;
      this.point = svg.createSVGPoint();
      this.setState(this.state);
    }
  }

  handleDrop(pos, canvasRect) {
    let type = this.props.grabbedNodeType;
    let zoom = this.props.zoom;
    let x = (pos[0] - canvasRect.left - (canvasRect.width / 2) - this.props.pan[0]) / zoom;
    let y = (pos[1] - canvasRect.top - (canvasRect.height / 2) - this.props.pan[1]) / zoom;
    let newNode = {
      type: type.id,
      pos: [x, y]
    };
    this.props.createNewNode(newNode);
    this.props.grabNodePlaceholder(null);
    this.props.showToolBox(false);
    this.svg.focus();
  }

  setHtmlNodeCanvas(htmlNodeCanvas) {
    if(htmlNodeCanvas !== undefined && htmlNodeCanvas !== null) {
      this.htmlNodeCanvas = htmlNodeCanvas;
    }
  }

  componentDidMount() {
    this.setState({ shouldGenerateConnectionsAfterMount: true });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.connections !== this.props.connections
      || prevProps.nodes !== this.props.nodes
      || prevProps.pan !== this.props.pan
      || prevProps.zoom !== this.props.zoom
      || prevProps.selectedNode !== this.props.selectedNode
      || this.state.shouldGenerateConnectionsAfterMount
    ) {
      this.setState({
        elementRects: this.getElementRects(),
        shouldGenerateConnectionsAfterMount: false
      });
    }
  }

  getElementRects() {
    if(this.htmlNodeCanvas === undefined) {
      return [];
    }
    let lines = this.props.connections.map((connection) => {
      let fromElm = this.htmlNodeCanvas
        .querySelector(`div[data-node-id="${connection.from.id}"] span[data-output-name="${connection.from.name}"]`);
      let fromRect = fromElm.getBoundingClientRect();

      let toElm = this.htmlNodeCanvas
        .querySelector(`div[data-node-id="${connection.to.id}"] span[data-input-name="${connection.to.name}"]`);
      let toRect = toElm.getBoundingClientRect();
      return {
        fromRect,
        toRect,
        key: `${connection.from.id}.${connection.from.name}->${connection.to.id}.${connection.to.name}`
      };
    });
    return lines;
  }

  render() {
    let {
      nodes,
      selectedNode,
      pan,
      zoom,
      connections
    } = this.props;
    let {
      grabTo,
      grabFrom,
      grabMode,
      elementRects
    } = this.state;
    let width = 0;
    let height = 0;
    if(this.htmlNodeCanvas !== undefined) {
      let rect = this.htmlNodeCanvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
    // Sort on x location, to enhance tabbing between nodes focus
    let nodeElements = Object.entries(nodes)
      .filter(node => node[1] !== undefined)
      .sort((a, b) => a[1].pos[0] - b[1].pos[0])
      .map(entry => {
        let id = +entry[0];
        let node = entry[1];
        let x = node.pos[0];
        let y = node.pos[1];
        if(this.htmlNodeCanvas !== undefined) {
          x += width / 2;
          y += height / 2;
        }
        return (<Node
          key={id}
          id={id}
          node={node}
          pos={[x, y]}
          connections={connections}
          selected={selectedNode === id}
          onConnectorMouseUp={this.onConnectorMouseUp}
          onConnectorMouseDown={this.onConnectorMouseDown}
          onDragbarMouseDown={this.onDragbarMouseDown}
          onNodeTouchStart={this.handleNodeTouchStart}
          onNodeTouchMove={this.handleNodeTouchMove}
          onNodeTouchEnd={this.handleTouchEnd}
          removeNode={this.props.removeNode}
        />);
      });
    return [
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onPointerDown={this.handleMouseDown}
        onPointerMove={this.handleMouseMove}
        onPointerUp={this.handleMouseUp}
        onKeyDown={this.onKeyDown}
        onWheel={this.onWheel}
        ref={this.setHtmlNodeCanvas}
        key="html-node-canvas"
        className={`html-node-canvas ${(this.state.grabMode !== undefined ? 'grabbing' : 'grab')}`}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan[0]}px, ${pan[1]}px)`,
            transformOrigin: `center ${height / 3}px`,
            willChange: 'transform'
          }}
        >
          {nodeElements}
        </div>
      </div>,
      <SvgLineDisplay
        key="SvgLineDisplay"
        setSvg={this.setSvg}
        elementRects={elementRects}
        grabTo={grabTo}
        grabFrom={grabFrom}
        grabMode={grabMode}
      />
    ];
  }
}

export default connect(
  state => (
    {
      connections: state.graph.connections,
      nodes: state.graph.nodes,
      selectedNode: state.editor.selectedNode,
      grabbedNodeType: state.editor.grabbedNodeType,
      pan: state.nodeEditor.pan,
      zoom: state.nodeEditor.zoom
    }),
  dispatch => (
    {
      createNewNode: node => {
        dispatch(actions.createNewNode(node));
      },
      setNodeLocation: (id, pos) => {
        dispatch(actions.moveNode(id, pos));
      },
      connectNodes: (from, to) => {
        dispatch(actions.connectNodes(from, to));
      },
      removeConnection: (nodeId, connectionName) => {
        dispatch(actions.removeConnection(nodeId, connectionName));
      },
      removeNode: (nodeId) => {
        dispatch(actions.removeNode(nodeId));
      },
      selectNode: (nodeId) => {
        dispatch(actions.selectNode(nodeId));
      },
      setNodeEditorView: (pan, zoom) => {
        dispatch(actions.setNodeEditorView(pan, zoom));
      },
      grabNodePlaceholder: (nodeType) => {
        dispatch(actions.grabNodePlaceholder(nodeType));
      },
      showToolBox: (show) => {
        dispatch(actions.showToolBox(show));
      }
    }
  )
)(GraphEditor);
