import React from 'react';
import PropTypes from 'prop-types';
import './SvgRenderer.less';
import SvgNode from './SvgNode';
import ConnectorLine from './ConnectorLine';
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
class SvgRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabFrom: [0, 0],
      grabConnectorType: undefined,
      grabMode: undefined,
      grabTo: [0, 0],
      lastPos: [0, 0],
      grabMoved: false,
      grabbedNode: -1,
      domConnections: [],
      shouldGenerateConnectionsAfterMount: false
    };

    [
      'handleDrop',
      'setSvg',
      'onElementMouseDown',
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
      'setHtmlNodeCanvas'
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

  onConnectorMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
    let t = event.target;

    let connectorName = event.target.getAttribute('data-output-name') || event.target.getAttribute('data-input-name');
    let svgNode = getNodeFromTarget(event.target, this.htmlNodeCanvas);
    let grabbedNode = Number(svgNode.getAttribute('data-node-id'));
    let connectorCenter = getCenter(t.getBoundingClientRect());
    let grabFrom = transformPointToSvgSpace(connectorCenter, this.svg, this.point);
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

  onElementMouseDown(event, id) {
    event.preventDefault();
    this.setState({
      lastPos: [event.clientX, event.clientY],
      grabbedNode: id,
      grabMode: 'element'
    });
  }

  handleTouchMove(event) {
    if(this.state.grabbedNode !== -1 || this.state.grabMode !== undefined) {
      if(event.buttons === 0) {
        this.setState({
          grabbedNode: -1,
          grabMode: undefined
        });
        return;
      }
      event.preventDefault();
      let touch = event.touches[0];
      this.onMove([touch.clientX, touch.clientY]);
    }
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
      this.onMove([event.clientX, event.clientY]);
    }
  }

  onMove(pos) {
    let delta = [
      (pos[0] - this.state.lastPos[0]),
      (pos[1] - this.state.lastPos[1])
    ];
    switch(this.state.grabMode) {
      case 'element': {
        let nodeId = this.state.grabbedNode;
        let node = this.props.nodes[nodeId];
        let newPos = [
          node.pos[0] + delta[0] / this.props.zoom,
          node.pos[1] + delta[1] / this.props.zoom
        ];
        this.props.setNodeLocation(nodeId, newPos);
      }
        break;
      case 'canvas': {
        let pan = [
          this.props.pan[0] + delta[0] / this.props.zoom,
          this.props.pan[1] + delta[1] / this.props.zoom
        ];
        this.props.setNodeEditorView(pan, this.props.zoom);
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

  handleTouchStart(event) {
    if(event.target === this.htmlNodeCanvas) {
      event.stopPropagation();
      event.preventDefault();
      let touch = event.touches[0];
      this.grabCanvas([touch.clientX, touch.clientY]);
    }
  }

  handleMouseDown(event) {
    if(event.target === this.htmlNodeCanvas) {
      event.stopPropagation();
      event.preventDefault();
      event.target.setPointerCapture(event.pointerId);
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
        domConnections: this.generateConnectionLines(),
        shouldGenerateConnectionsAfterMount: false
      });
    }
  }

  generateConnectionLines() {
    if(this.svg === undefined || this.htmlNodeCanvas === undefined) {
      return [];
    }
    let lines = this.props.connections.map((connection) => {
      let fromElm = this.htmlNodeCanvas
        .querySelector(`div[data-node-id="${connection.from.id}"] span[data-output-name="${connection.from.name}"]`);
      let from = transformPointToSvgSpace(
        getCenter(fromElm.getBoundingClientRect()),
        this.svg, this.point);

      let toElm = this.htmlNodeCanvas
        .querySelector(`div[data-node-id="${connection.to.id}"] span[data-input-name="${connection.to.name}"]`);
      let to = transformPointToSvgSpace(
        getCenter(toElm.getBoundingClientRect()),
        this.svg, this.point);
      return {
        from,
        to,
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
      domConnections
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
          x = node.pos[0] + width / 2;
          y = node.pos[1] + height / 2;
        }
        x += pan[0];
        y += pan[1];
        return (<SvgNode
          key={id}
          id={id}
          node={node}
          pos={[x, y]}
          connections={connections}
          selected={selectedNode === id}
          onConnectorMouseUp={this.onConnectorMouseUp}
          onConnectorMouseDown={this.onConnectorMouseDown}
          onElementMouseDown={event => this.onElementMouseDown(event, id)}
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
            transform: `scale(${zoom})`,
            transformOrigin: `center ${height / 3}px`
          }}
        >
          {nodeElements}
        </div>
      </div>,
      <svg
        className="node-svg"
        ref={this.setSvg}
        key="svg-canvas"
      >
        {
          domConnections.map((connection) => (
            <ConnectorLine
              key={connection.key}
              from={connection.from}
              to={connection.to}
            />
          ))
        }
        {(grabMode === 'connector') &&
          <ConnectorLine
            from={grabFrom}
            to={grabTo}
          />
        }
      </svg>
    ];
  }
}


SvgRenderer.propTypes = {
  createNewNode: PropTypes.func.isRequired,
  nodes: PropTypes.any.isRequired,
  connections: PropTypes.array.isRequired,
  removeConnection: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  setNodeLocation: PropTypes.func.isRequired,
  connectNodes: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selectedNode: PropTypes.number.isRequired,
  pan: PropTypes.array.isRequired,
  setNodeEditorView: PropTypes.func.isRequired,
  grabbedNodeType: PropTypes.object,
  grabNodePlaceholder: PropTypes.func.isRequired,
  showToolBox: PropTypes.func.isRequired
};

export default SvgRenderer;
