import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './SvgRenderer.less';
import { SvgNode } from './SvgNode';
import { findNode, addInSvgSpace, transformPointToSvgSpace } from '../../utils/NodeUtils'

class SvgRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragMode: null,
    }
    this.handleDrop = this.handleDrop.bind(this);
    this.setSvg = this.setSvg.bind(this);
    this.onElementMouseDown = this.onElementMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onConnectorMouseUp = this.onConnectorMouseUp.bind(this);
    this.onConnectorMouseDown = this.onConnectorMouseDown.bind(this);
  }

  componentDidMount() {
  }

  handleDrop(event) {
    event.preventDefault();
    let type = JSON.parse(event.dataTransfer.getData("text/plain"));
    this.point.x = event.clientX;
    this.point.y = event.clientY;
    let newCoords = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
    let newNode = {
      type,
      name: type.name,
      pos: [newCoords.x, newCoords.y]
    }
    this.props.createNewNode(newNode);
  }

  onConnectorMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    let c = transformPointToSvgSpace([event.clientX, event.clientY], this.svg);

    let nodeId = -1;
    let parent = event.target.parentElement;
    while(!(parent instanceof SVGSVGElement)) {
      if(parent.hasAttribute("data-node-id")) {
        nodeId = parent.getAttribute("data-node-id");
        break;
      }
      parent = parent.parentElement;
    }

    this.setState({
      dragMode: "connector",
      dragNodeId: nodeId,
      dragTo: c,
      dragFrom: c,
      lastX: event.clientX,
      lastY: event.clientY
    });
  }

  onElementMouseDown(event, node) {
    this.setState({
      dragMode: "element",
      dragNodeId: node.id,
      lastX: event.clientX,
      lastY: event.clientY
    })
  }

  onMouseMove(event) {
    if(this.state.dragMode != null) {
      let dx = event.clientX - this.state.lastX;
      let dy = event.clientY - this.state.lastY;
      this.setState({
        lastX: event.clientX,
        lastY: event.clientY
      });

      if(this.state.dragMode === "element") {
        let node = findNode(this.props.graph, this.state.dragNodeId);
        let newPos = addInSvgSpace(node.pos, [dx, dy], this.svg)
        this.props.setNodeLocation(this.state.dragNodeId, newPos);
      } else if(this.state.dragMode === "connector") {
        let dragTo = addInSvgSpace(this.state.dragTo, [dx, dy], this.svg)
        this.setState({ dragTo });
      }
    }
  }

  onConnectorMouseUp(event) {
    let target = event.target;
    if(target.hasAttribute("data-input-name")) {
      let nodeId = -1;
      let parent = target.parentElement;
      while(!(parent instanceof SVGSVGElement)) {
        if(parent.hasAttribute("data-node-id")) {
          nodeId = parent.getAttribute("data-node-id");
          break;
        }
        parent = parent.parentElement;
      }
      if(nodeId != -1 && nodeId != this.state.dragNodeId) {
        console.log(`create connection from ${this.state.dragNodeId} to ${nodeId}`);
      }
    }
    this.onMouseUp();
  }

  onMouseUp(event) {
    this.setState({
      dragMode: null,
      dragNodeId: null
    })
  }

  preventEvent(event) {
    event.preventDefault();
  }

  setSvg(svg) {
    this.svg = svg;
    this.point = svg.createSVGPoint();
  }

  render() {
    let { graph, nodes, connections } = this.props;
    let { dragTo, dragFrom } = this.state;
    let circles = nodes.map(node => <SvgNode key={node.id} node={node}  onConnectorMouseUp={this.onConnectorMouseUp} onConnectorMouseDown={this.onConnectorMouseDown} onElementMouseDown={(event) => this.onElementMouseDown(event, node)}/>);
    let lines = connections.map(connection => {
      let node1 = nodes[connection[0]];
      let node2 = nodes[connection[1]];
      let key = `${node1.pos[0]}${node1.pos[1]}${node2.pos[0]}${node2.pos[1]}`;
      return <line key={key} x1={node1.pos[0]} y1={node1.pos[1]} x2={node2.pos[0]} y2={node2.pos[1]} strokeWidth="2" stroke="black"/>
    });
    let connectorLine = null;
    if(this.state.dragMode === "connector") {
      connectorLine = <line className="connector-line" x1={dragFrom[0]} y1={dragFrom[1]} x2={dragTo[0]} y2={dragTo[1]} stroke="black" strokeWidth="2" />
    }
    let w = 200;
    let viewBox = `-${w} -${w} ${w*2} ${w*2}`;
    //TODO: Set svg viewBox depending on svg size
    return (
      <svg ref={this.setSvg} onDrop={this.handleDrop} onDragOver={this.preventEvent} onDragEnter={this.preventEvent} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} viewBox={viewBox}>
        {circles}
        {lines}
        {connectorLine}
      </svg>
    );
  }
}

SvgRenderer.propTypes = {
  graph: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  connections: PropTypes.array.isRequired,
  createNewNode: PropTypes.func.isRequired,
  setNodeLocation: PropTypes.func.isRequired
}

export default SvgRenderer;
