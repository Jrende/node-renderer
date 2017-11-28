import React from 'react';
import PropTypes from 'prop-types';
import './SvgRenderer.less';
import SvgNode from './SvgNode';
import { addInSvgSpace, transformPointToSvgSpace } from '../../utils/SvgUtils';

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
      zoom: 0
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

  //Wheee!
  //TODO: Zoom towards mouse pointer or center of screen
  onWheel(event) {
    let zoom = this.state.zoom + event.deltaY;
    if(zoom > -200) {
      this.setState({
        zoom
      });
    }
  }

  onKeyDown(event) {
    if(event.key === 'Delete') {
      if(document.activeElement != null) {
        let activeNodeId = document.activeElement.getAttribute('data-node-id')|0;
        this.props.removeNode(activeNodeId);
      }
    }
  }

  onConnectorMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    let c = transformPointToSvgSpace([event.clientX, event.clientY], this.svg);
    let grabTo = c;
    let grabFrom = c;

    let grabNodeName = event.target.getAttribute('data-output-name') || event.target.getAttribute('data-input-name');
    let grabNodeId = -1;
    let parent = event.target.parentElement;
    while(!(parent instanceof SVGSVGElement)) {
      if(parent.hasAttribute('data-node-id')) {
        grabNodeId = parent.getAttribute('data-node-id')|0;
        break;
      }
      parent = parent.parentElement;
    }

    let grabConnectorType = event.target.hasAttribute('data-output-name') ? 'output' : 'input';
    if(grabConnectorType === 'input') {
      let node = this.props.graph.find(n => n.id === grabNodeId);
      if(node.input[grabNodeName] !== undefined) {
        let outputNode = this.props.graph.find(n => n.id === node.input[grabNodeName].id);
        this.props.removeConnection(grabNodeId, grabNodeName);
        grabNodeId = outputNode.id;
        grabNodeName = node.input[grabNodeName].name;
        grabConnectorType = 'output';
        grabFrom = this.getNodeLayout(outputNode.type).getConnectorPos(grabNodeName);
        grabFrom[0] += outputNode.pos[0] + 15;
        grabFrom[1] += outputNode.pos[1] - 5;
      }
    }
    this.setState({
      grabNodeId,
      grabNodeName,
      grabMode: 'connector',
      grabConnectorType,
      grabTo,
      grabFrom,
      lastPos: [event.clientX, event.clientY]
    });
  }

  onElementMouseDown(event, node) {
    this.props.selectNode(node.id);
    this.setState({
      grabMode: 'element',
      grabNodeId: node.id,
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
      let dx = event.clientX - this.state.lastPos[0];
      let dy = event.clientY - this.state.lastPos[1];
      this.setState({
        lastPos: [event.clientX, event.clientY]
      });

      switch(this.state.grabMode) {
        case 'element': {
          let node = this.props.graph.find(item => item.id === this.state.grabNodeId);
          let newPos = addInSvgSpace(node.pos, [dx, dy], this.svg);
          this.props.setNodeLocation(this.state.grabNodeId, newPos);
          break;
        }
        case 'connector': {
          let grabTo = addInSvgSpace(this.state.grabTo, [dx, dy], this.svg);
          this.setState({ grabTo });
          break;
        }
        case 'canvas': {
          let pan = addInSvgSpace(this.state.pan, [dx, dy], this.svg);
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
          nodeId = parent.getAttribute('data-node-id')|0;
          break;
        }
        parent = parent.parentElement;
      }
      if(nodeId !== -1 && nodeId !== this.state.grabNodeId) {
        let from = {
          id: this.state.grabNodeId,
          name: this.state.grabNodeName
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
      let transformedPos = transformPointToSvgSpace(clientPos, this.svg);
      this.props.selectNode(-1);
      this.setState({
        grabMode: 'canvas',
        grabTo: transformedPos,
        grabFrom: transformedPos,
        lastPos: clientPos
      });
    }
  }

  setSvg(svg) {
    if(svg != null) {
      this.svg = svg;
      this.point = svg.createSVGPoint();
      svg.addEventListener('drop', event => this.handleDrop(event));
    }
  }

  getNodeLayout(type) {
    let inputs = Object.keys(type.input||[]);
    let outputs = Object.keys(type.output||[]);
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
          output = [width-sideMargin, outputs.indexOf(name) * lineHeight + offset];
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
    let newNode = {
      type,
      pos: [
        newCoords.x - nodeLayout.width / 2.0,
        newCoords.y - nodeLayout.height / 2.0
      ]
    };
    this.props.createNewNode(newNode);
  }

  handleDragEnter() {
    console.log('dragenter');
  }

  render() {
    let { graph, connections, selectedNode } = this.props;
    let { grabTo, grabFrom, grabMode, zoom, pan } = this.state;
    let nodes = graph.map(node => (
      <SvgNode
        key={node.id}
        node={node}
        selected={selectedNode === node.id}
        nodeLayout={this.getNodeLayout(node.type)}
        onConnectorMouseUp={this.onConnectorMouseUp}
        onConnectorMouseDown={this.onConnectorMouseDown}
        onElementMouseDown={event => this.onElementMouseDown(event, node)}
      />
    ));

    let lines = connections.map((connection) => {
      let node1 = graph.find(node => node.id === connection.from.id);
      let fromPos = this.getNodeLayout(node1.type).getConnectorPos(connection.from.name);
      fromPos[0] += node1.pos[0] - 15;
      fromPos[1] += node1.pos[1] - 5;
      let node2 = graph.find(node => node.id === connection.to.id);
      let toPos = this.getNodeLayout(node2.type).getConnectorPos(connection.to.name);
      toPos[0] += node2.pos[0] + 15;
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
    let w = 200 + zoom;
    let zIndex = 0;
    if(grabMode !== null && grabMode !== 'canvas') {
      zIndex = 2;
    }
    let style = { zIndex };
    let viewBox = `${-w - pan[0]} ${-w - pan[1]} ${w*2} ${w*2}`;
    //TODO: Set svg viewBox depending on svg size
    return (
      <svg
        style={style}
        className="node-svg"
        ref={this.setSvg}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onCanvasMouseDown}
        onKeyDown={this.onKeyDown}
        onWheel={this.onWheel}
        viewBox={viewBox}
      >
        {lines}
        {connectorLine}
        {nodes}
      </svg>
    );
  }
}

SvgRenderer.propTypes = {
  graph: PropTypes.array.isRequired,
  connections: PropTypes.array.isRequired,
  createNewNode: PropTypes.func.isRequired,
  removeConnection: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  setNodeLocation: PropTypes.func.isRequired,
  connectNodes: PropTypes.func.isRequired,
  selectNode: PropTypes.func,
  selectedNode: PropTypes.number
};

export default SvgRenderer;
