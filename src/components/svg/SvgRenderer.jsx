import React from 'react';
import PropTypes from 'prop-types';
import './SvgRenderer.less';
import SvgNode from './SvgNode';
import { addInSvgSpace, transformPointToSvgSpace, transformPointFromSvgSpace } from '../../utils/SvgUtils';

/* globals SVGSVGElement */
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
      pan: [0, 0]
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.setSvg = this.setSvg.bind(this);
    this.onElementMouseDown = this.onElementMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onConnectorMouseUp = this.onConnectorMouseUp.bind(this);
    this.onConnectorMouseDown = this.onConnectorMouseDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
  }

  onKeyDown(event) {
    console.log(event.key);
    if(event.key === "Delete") {
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
    if(grabConnectorType === "input") {
      let node = this.props.graph.find(n => n.id === grabNodeId);
      if(node.input[grabNodeName] != undefined) {
        let outputNode = this.props.graph.find(n => n.id === node.input[grabNodeName].id);
        this.props.removeConnection(grabNodeId, grabNodeName)
        grabNodeId = outputNode.id;
        grabNodeName = node.input[grabNodeName].name;
        grabConnectorType = "output";
        grabFrom = this.getConnectorPosFunc(outputNode)(grabNodeName);
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
    this.setState({
      grabMode: 'element',
      grabNodeId: node.id,
      lastPos: [event.clientX, event.clientY]
    });
  }

  onMouseMove(event) {
    if(this.state.grabMode != null) {
      let dx = event.clientX - this.state.lastPos[0];
      let dy = event.clientY - this.state.lastPos[1];
      this.setState({
        lastPos: [event.clientX, event.clientY]
      });

      switch(this.state.grabMode) {
        case 'element':
          let node = this.props.graph.find(item => item.id === this.state.grabNodeId);
          let newPos = addInSvgSpace(node.pos, [dx, dy], this.svg);
          this.props.setNodeLocation(this.state.grabNodeId, newPos);
          break;
        case 'connector':
          let grabTo = addInSvgSpace(this.state.grabTo, [dx, dy], this.svg);
          this.setState({ grabTo });
          break;
        case 'canvas':
          let pan = addInSvgSpace(this.state.pan, [dx, dy], this.svg);
          this.setState({ pan });
          console.log("pan: ", pan);
          break;
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
        if(this.state.grabConnectorType === "input") {
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

  setSvg(svg) {
    this.svg = svg;
    this.point = svg.createSVGPoint();
  }

  getConnectorPosFunc(node) {
    let inputs = Object.keys(node.type.input);
    let outputs = Object.keys(node.type.output);
    //let height = 20 + Math.max(inputs.length, outputs.length) * 25;
    let lineHeight = 20;
    let width = 100;
    let offset = 40;
    let sideMargin = 10;
    return (name) => {
      let output = [0, 0];
      if(node.type.input[name] != null) {
        output = [sideMargin, inputs.indexOf(name) * lineHeight + offset];
      }
      if(node.type.output[name] != null) {
        output = [width-sideMargin, outputs.indexOf(name) * lineHeight + offset];
      }
      return output;
    };
  }

  preventEvent(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    let type = JSON.parse(event.dataTransfer.getData('text/plain'));
    this.point.x = event.clientX;
    this.point.y = event.clientY;
    let newCoords = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
    let newNode = {
      type,
      pos: [newCoords.x, newCoords.y]
    };
    this.props.createNewNode(newNode);
  }

  onCanvasMouseDown(event) {
    if(event.target == this.svg) {
      event.stopPropagation();
      event.preventDefault();
      let clientPos = [event.clientX, event.clientY];
      let transformedPos = transformPointToSvgSpace(clientPos, this.svg);
      this.setState({
        grabMode: 'canvas',
        grabTo: transformedPos,
        grabFrom: transformedPos,
        lastPos: clientPos
      });
    }
  }

  render() {
    let { graph, connections } = this.props;
    let { grabTo, grabFrom, pan } = this.state;
    let nodes = graph.map(node => (
      <SvgNode
        key={node.id}
        node={node}
        connectorPosFunc={this.getConnectorPosFunc(node)}
        onConnectorMouseUp={this.onConnectorMouseUp}
        onConnectorMouseDown={this.onConnectorMouseDown}
        onElementMouseDown={event => this.onElementMouseDown(event, node)}
      />
    ));

    let lines = connections.map((connection) => {
      let node1 = graph.find(node => node.id === connection.from.id);
      let fromPos = this.getConnectorPosFunc(node1)(connection.from.name);
      fromPos[0] += node1.pos[0] - 15;
      fromPos[1] += node1.pos[1] - 5;
      let node2 = graph.find(node => node.id === connection.to.id);
      let toPos = this.getConnectorPosFunc(node2)(connection.to.name);
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
    if(this.state.grabMode === 'connector') {
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
    let w = 200;
    let style = {
      zIndex: this.state.grabMode == null ? 0 : 2
    }
    let viewBox = `${-w - pan[0]} ${-w - pan[1]} ${w*2} ${w*2}`;
    //TODO: Set svg viewBox depending on svg size
    return (
      <svg
        style={style}
        ref={this.setSvg}
        onDrop={this.handleDrop}
        onDragOver={this.preventEvent}
        onDragEnter={this.preventEvent}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onCanvasMouseDown}
        onKeyDown={this.onKeyDown}
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
  connectNodes: PropTypes.func.isRequired
};

export default SvgRenderer;
