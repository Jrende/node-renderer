import React from 'react';
import PropTypes from 'prop-types';
import './SvgRenderer.less';
import SvgNode from './SvgNode';
import ConnectorLine from './ConnectorLine';
import { transformPointToSvgSpace, addInSvgSpace, getSvgSize } from '../../utils/SvgUtils';

function getCenter(r) {
  return [
    r.x + (r.width / 2),
    r.y + (r.height / 2)
  ];
}

/* globals SVGSVGElement, document */
class SvgRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabFrom: [0, 0],
      grabConnectorType: null,
      grabTo: [0, 0],
      lastPos: [0, 0],
      grabMoved: false,
      grabMode: null,
      grabbedNode: -1,
      zoom: 1,
      domConnections: []
    };

    [
      'handleDrop',
      'setSvg',
      'onElementMouseDown',
      'onMouseMove',
      'onMouseUp',
      'onConnectorMouseUp',
      'onConnectorMouseDown',
      'onKeyDown',
      'onCanvasMouseDown',
      'onWheel',
      'setHtmlNodeCanvas'
    ].forEach(name => { this[name] = this[name].bind(this); });
  }

  getNodeFromTarget(target) {
    let parent = target;
    while(parent !== this.htmlNodeCanvas) {
      if(parent.hasAttribute('data-node-id')) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return undefined;
  }


  // TODO: Zoom towards mouse pointer or center of screen
  onWheel(event) {
    let deltaY = event.deltaY;
    // Firefox gives scroll in number of lines. We convert that into pixel values matching Chrome
    if(event.deltaMode === 1) {
      deltaY *= 18;
    }
    let zoom = this.state.zoom + deltaY / 200;
    if(zoom > 0) {
      // this.setState({ zoom });
    }
  }

  onKeyDown(event) {
    if(event.key === 'Delete') {
      if(document.activeElement != null) {
        let activeNodeId = document.activeElement.getAttribute('data-node-id') | 0;
        this.props.removeNode(activeNodeId);
      }
    }
  }

  onConnectorMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    let t = event.target;

    let connectorName = event.target.getAttribute('data-output-name') || event.target.getAttribute('data-input-name');
    let svgNode = this.getNodeFromTarget(event.target);
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
    this.setState({
      lastPos: [event.clientX, event.clientY],
      grabbedNode: id,
      grabMode: 'element'
    });
  }

  onMouseMove(event) {
    if(this.state.grabbedNode !== -1 || this.state.grabMode != null) {
      if(event.buttons === 0) {
        this.setState({
          grabbedNode: -1,
          grabMode: null
        });
        return;
      }
      let delta = [
        (event.clientX - this.state.lastPos[0]),
        (event.clientY - this.state.lastPos[1])
      ];
      this.setState({
        grabMoved: true,
        lastPos: [event.clientX, event.clientY]
      });

      if(this.state.grabMode === 'element') {
        let nodeId = this.state.grabbedNode;
        let node = this.props.nodes[nodeId];
        let newPos = [
          node.pos[0] + delta[0],
          node.pos[1] + delta[1]
        ];
        this.props.setNodeLocation(nodeId, newPos);
      } else if (this.state.grabMode === 'connector') {
        let grabTo = addInSvgSpace(this.state.grabTo, delta, this.svg, this.point);
        this.setState({ grabTo });
      } else if (this.state.grabMode === 'canvas') {
        delta = delta.map(v => v * this.props.zoom);
        let pan = [
          this.props.pan[0] + delta[0],
          this.props.pan[1] + delta[1]
        ];
        this.props.setNodeEditorView(pan, this.props.zoom);
      }
    }
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
      if(nodeId !== -1 && nodeId !== this.state.grabbedNode) {
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

  onMouseUp(event) {
    if(this.props.grabbedNodeType != null) {
      this.handleDrop(event);
    }
    let elmBelow = document.elementsFromPoint(event.clientX, event.clientY)[1];
    if(elmBelow.classList.contains('io-grab')) {
      this.onConnectorMouseUp(elmBelow);
    }

    if(!this.state.grabMoved && this.state.grabbedNode !== -1) {
      this.props.selectNode(this.state.grabbedNode);
    }
    this.setState({
      grabbedNode: -1
    });
    this.setState({
      grabMoved: false,
      grabMode: null
    });
  }

  onCanvasMouseDown(event) {
    if(event.target === this.svg) {
      event.stopPropagation();
      let clientPos = [event.clientX, event.clientY];
      let svgNode = this.svg.querySelector('.svg-node');
      let transformedPos = transformPointToSvgSpace(clientPos, svgNode, this.point);
      this.props.selectNode(-1);
      this.setState({
        grabTo: transformedPos,
        grabFrom: transformedPos,
        lastPos: clientPos,
        grabMode: 'canvas'
      });
    }
  }

  setSvg(svg) {
    if(svg != null) {
      this.svg = svg;
      this.point = svg.createSVGPoint();
      this.setState(this.state);
    }
  }

  handleDrop(event) {
    event.preventDefault();
    let type = this.props.grabbedNodeType;
    this.point.x = event.clientX;
    this.point.y = event.clientY;
    // TODO: Fix this
    let width = 0;
    let height = 0;
    let newCoords = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
    let svgSize = getSvgSize(this.svg);
    let newNode = {
      type: type.id,
      pos: [
        newCoords.x - width / 2.0 - this.props.pan[0] - svgSize[0] / 2.0,
        newCoords.y - height / 2.0 - this.props.pan[1] - svgSize[1] / 2.0
      ].map(v => v * this.state.zoom)
    };
    this.props.createNewNode(newNode);
    this.props.grabNodePlaceholder(null);
    this.props.showToolBox(false);
    this.svg.focus();
  }

  setHtmlNodeCanvas(element) {
    this.htmlNodeCanvas = element;
  }

  componentDidUpdate(prevProps) {
    // This could me smarter about when to change
    if(prevProps.connections !== this.props.connections || prevProps.nodes !== this.props.nodes) {
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
      this.setState({ domConnections: lines });
    }
  }

  render() {
    let {
      nodes,
      selectedNode
    } = this.props;
    let {
      grabTo,
      grabFrom,
      grabMode,
      zoom,
      domConnections
    } = this.state;
    // Sort on x location, to enhance tabbing between nodes focus
    let nodeElements = Object.entries(nodes)
      .filter(node => node[1] != null)
      .sort((a, b) => a[1].pos[0] - b[1].pos[0])
      .map(entry => {
        let id = +entry[0];
        let node = entry[1];
        return (<SvgNode
          key={id}
          id={id}
          node={node}
          selected={selectedNode === id}
          onConnectorMouseUp={this.onConnectorMouseUp}
          onConnectorMouseDown={this.onConnectorMouseDown}
          onElementMouseDown={event => this.onElementMouseDown(event, id)}
          htmlNodeCanvas={this.htmlNodeCanvas}
        />);
      });

    let connectorLine = null;
    if(grabMode === 'connector') {
      connectorLine = (
        <ConnectorLine
          from={grabFrom}
          to={grabTo}
        />
      );
    }
    let mouseMoveDiv;
    if(this.state.grabbedNode !== -1 || this.state.grabMode != null) {
      mouseMoveDiv = (
        <div
          className="covering-div"
          key="svg-covering-div"
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        />
      );
    }

    return [
      mouseMoveDiv,
      <div
        onMouseDown={this.onCanvasMouseDown}
        onKeyDown={this.onKeyDown}
        onWheel={this.onWheel}
        ref={this.setHtmlNodeCanvas}
        key="html-node-canvas"
        className="html-node-canvas"
      >
        {nodeElements}
      </div>,
      <svg
        className="node-svg"
        ref={this.setSvg}
        key="svg-canvas"
        width="100%"
        height="100%"
      >
        <g>
          {
            domConnections.map((connection) => (
              <ConnectorLine
                key={connection.key}
                from={connection.from}
                to={connection.to}
              />
            ))
          }
          {connectorLine}
        </g>
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
