import { mat3 } from 'gl-matrix';
import React from 'react';
import PropTypes from 'prop-types';
import './SvgRenderer.less';
import SvgNode from './SvgNode';
import { addInSvgSpace, transformPointToSvgSpace } from '../../utils/SvgUtils';

function getSvgNodeFromTarget(target) {
  let parent = target;
  while(!(parent instanceof SVGSVGElement)) {
    if(parent.hasAttribute('data-node-id')) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return undefined;
}

/* globals SVGSVGElement, document */
class SvgRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabFrom: [0, 0],
      grabConnectorType: null,
      grabTo: [0, 0],
      grabMode: null,
      grabNodeId: -1,
      lastPos: [0, 0],
      pan: [0, 0],
      zoom: 1
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
      'onWheel'
    ].forEach(name => { this[name] = this[name].bind(this); });
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
      console.log(`zoom: ${zoom}`);
      this.setState({
        zoom
      });
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

    let connectorName = event.target.getAttribute('data-output-name') || event.target.getAttribute('data-input-name');
    let svgNode = getSvgNodeFromTarget(event.target);
    let grabNodeId = svgNode.getAttribute('data-node-id') | 0;

    let node = this.props.nodes[grabNodeId];
    let svgSize = this.getSvgSize();
    let coord = transformPointToSvgSpace(
      [
        event.clientX + node.pos[0],
        event.clientY + node.pos[1]
      ],
      svgNode,
      this.point
    );
    coord[0] /= this.state.zoom;
    coord[1] /= this.state.zoom;
    let grabFrom = coord;
    let grabTo = coord;

    let grabConnectorType = event.target.hasAttribute('data-output-name') ? 'output' : 'input';
    if(grabConnectorType === 'input') {
      let existingConnection = this.props.connections.find(c =>
        c.to.id === grabNodeId && c.to.name === connectorName);
      // If there is an existing connection, we want to change that one instead.
      if(existingConnection !== undefined) {
        let outputNode = this.props.nodes[existingConnection.from.id];
        this.props.removeConnection(existingConnection.from, existingConnection.to);
        grabNodeId = existingConnection.from.id;
        connectorName = existingConnection.from.name;
        grabConnectorType = 'output';
        grabFrom = this.getNodeLayout(outputNode.type).getConnectorPos(connectorName);
        grabFrom[0] += outputNode.pos[0] + 15;
        grabFrom[1] += outputNode.pos[1] - 5;
      }
    }
    this.setState({
      grabNodeId,
      connectorName,
      grabMode: 'connector',
      grabConnectorType,
      grabTo,
      grabFrom,
      lastPos: [event.clientX, event.clientY]
    });
  }

  onElementMouseDown(event, id) {
    this.props.selectNode(+id);
    this.setState({
      grabMode: 'element',
      grabNodeId: +id,
      lastPos: [event.clientX, event.clientY]
    });
  }

  onMouseMove(event) {
    if(this.state.grabMode != null) {
      if(event.buttons === 0) {
        this.setState({
          grabMode: null,
          grabNodeId: null
        });
        return;
      }
      let delta = [
        (event.clientX - this.state.lastPos[0]),
        (event.clientY - this.state.lastPos[1])
      ];
      this.setState({
        lastPos: [event.clientX, event.clientY]
      });

      switch(this.state.grabMode) {
        case 'element': {
          let svgNode = this.svg.querySelector(`.svg-node[data-node-id='${this.state.grabNodeId}']`);
          let node = this.props.nodes[this.state.grabNodeId];
          let newPos = addInSvgSpace(node.pos, delta, svgNode, this.point);
          this.props.setNodeLocation(this.state.grabNodeId, newPos);
          break;
        }
        case 'connector': {
          let svgNode = this.svg.querySelector(`.svg-node[data-node-id='${this.state.grabNodeId}']`);
          let grabTo = addInSvgSpace(this.state.grabTo, delta, svgNode, this.point);
          this.setState({ grabTo });
          break;
        }
        case 'canvas': {
          delta = delta.map(v => v * this.state.zoom);
          let pan = addInSvgSpace(this.state.pan, delta, this.svg, this.point);
          this.setState({ pan });
          break;
        }
        default:
      }
    }
  }

  onConnectorMouseUp(event) {
    let target = event.target;
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
      if(nodeId !== -1 && nodeId !== this.state.grabNodeId) {
        let from = {
          id: this.state.grabNodeId,
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
        this.props.connectNodes(from, to);
      }
    }
    this.onMouseUp();
  }

  onMouseUp() {
    this.setState({
      grabMode: null,
      grabNodeId: null
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
        grabMode: 'canvas',
        grabTo: transformedPos,
        grabFrom: transformedPos,
        lastPos: clientPos
      });
    }
  }

  getSvgSize() {
    let size = [0, 0];
    if(this.svg !== undefined) {
      size = [
        this.svg.clientWidth || this.svg.parentNode.clientWidth,
        this.svg.clientHeight || this.svg.parentNode.clientHeight
      ];
    }
    return size;
  }

  setSvg(svg) {
    if(svg != null) {
      this.svg = svg;
      this.point = svg.createSVGPoint();
      let s = this.getSvgSize();
      this.setState({
        pan: [0, 0]
      });
      svg.addEventListener('drop', event => this.handleDrop(event));
    }
  }

  getNodeLayout(type) {
    let inputs = Object.keys(type.input || []);
    let outputs = Object.keys(type.output || []);
    let height = 20 + Math.max(inputs.length, outputs.length);
    let lineWidths = [];
    for(let i = 0; i < Math.max(inputs.length, outputs.length); i++) {
      let inputLen = inputs[i] !== undefined ? inputs[i].length : 0;
      let outputLen = outputs[i] !== undefined ? outputs[i].length : 0;
      lineWidths[i] = inputLen + outputLen;
      if(inputLen > 0 && outputLen > 0) {
        lineWidths[i] += 4;
      }
    }
    let maxLine = Math.max(...lineWidths);

    let lineHeight = 20;
    let width = Math.max(maxLine, type.name.length) * 10 + 5;
    if(inputs.length > 0 && outputs.length > 0) {
      width += 20;
    }
    let offset = 40;
    let sideMargin = 10;
    return {
      getConnectorPos(name) {
        let output = [0, 0];
        if(type.input != null && type.input[name] != null) {
          output = [sideMargin, inputs.indexOf(name) * lineHeight + offset];
        }
        if(type.output != null && type.output[name] != null) {
          output = [width - sideMargin, outputs.indexOf(name) * lineHeight + offset];
        }
        return output;
      },
      width,
      height
    };
  }

  preventEvent(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    let type = event.detail.type;
    let nodeLayout = this.getNodeLayout(type);
    this.point.x = event.clientX;
    this.point.y = event.clientY;
    let newCoords = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
    let svgSize = this.getSvgSize();
    let newNode = {
      type: type.id,
      pos: [
        newCoords.x - nodeLayout.width / 2.0 - this.state.pan[0] - svgSize[0] / 2.0,
        newCoords.y - nodeLayout.height / 2.0 - this.state.pan[1] - svgSize[1] / 2.0
      ].map(v => v * this.state.zoom)
    };
    this.props.createNewNode(newNode);
  }

  render() {
    let { nodes, connections, selectedNode } = this.props;
    let { grabTo, grabFrom, grabMode, zoom, pan } = this.state;
    // Sort on x location, to enhance tabbing between nodes focus
    let nodeElements = Object.entries(nodes)
      .sort((a, b) => a[1].pos[0] - b[1].pos[0])
      .map(entry => {
        let id = +entry[0];
        let node = entry[1];
        return (<SvgNode
          key={id}
          id={id}
          node={node}
          selected={selectedNode === id}
          nodeLayout={this.getNodeLayout(node.type)}
          onConnectorMouseUp={this.onConnectorMouseUp}
          onConnectorMouseDown={this.onConnectorMouseDown}
          onElementMouseDown={event => this.onElementMouseDown(event, id)}
        />);
      });

    let lines = connections.map((connection) => {
      let node1 = nodes[connection.from.id];
      let fromPos = this.getNodeLayout(node1.type).getConnectorPos(connection.from.name);
      fromPos[0] += node1.pos[0] + 15;
      fromPos[1] += node1.pos[1] - 5;
      let node2 = nodes[connection.to.id];
      let toPos = this.getNodeLayout(node2.type).getConnectorPos(connection.to.name);
      toPos[0] += node2.pos[0] - 15;
      toPos[1] += node2.pos[1] - 5;
      let key = `${connection.from.id}.${connection.from.name}->${connection.to.id}.${connection.to.name}`;
      return (
        <line
          key={key}
          className="connector-line"
          x1={fromPos[0]}
          y1={fromPos[1]}
          x2={toPos[0]}
          y2={toPos[1]}
          strokeWidth="2"
          stroke="black"
        />
      );
    });
    let connectorLine = null;
    if(grabMode === 'connector') {
      connectorLine = (<line
        className="connector-line"
        x1={grabFrom[0]}
        y1={grabFrom[1]}
        x2={grabTo[0]}
        y2={grabTo[1]}
        stroke="black"
        strokeWidth="2"
      />);
    }
    let zIndex = 0;
    if(grabMode !== null && grabMode !== 'canvas') {
      zIndex = 2;
    }

    let m = mat3.create();
    if(this.svg !== undefined) {
      let svgSize = this.getSvgSize();
      mat3.translate(m, m, [svgSize[0] / 2, svgSize[1] / 2]);
    }
    let zoomVal = 1 / zoom;
    mat3.translate(m, m, pan);
    mat3.scale(m, m, [zoomVal, zoomVal]);
    mat3.transpose(m, m);
    let svgMat = `${m[0]}, ${m[3]}, ${m[1]}, ${m[4]}, ${m[2]}, ${m[5]}`;

    return (
      <svg
        style={{ zIndex }}
        className="node-svg"
        ref={this.setSvg}
        width="100%"
        height="100%"
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onCanvasMouseDown}
        onKeyDown={this.onKeyDown}
        onWheel={this.onWheel}
      >
        <g transform={`matrix(${svgMat})`}>
          {lines}
          {connectorLine}
          {nodeElements}
        </g>
      </svg>
    );
  }
}

SvgRenderer.propTypes = {
  nodes: PropTypes.array.isRequired,
  connections: PropTypes.array.isRequired,
  createNewNode: PropTypes.func.isRequired,
  removeConnection: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  setNodeLocation: PropTypes.func.isRequired,
  connectNodes: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selectedNode: PropTypes.number.isRequired
};

export default SvgRenderer;
