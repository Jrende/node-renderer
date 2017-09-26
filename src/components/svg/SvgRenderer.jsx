import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './SvgRenderer.less';
import { SvgNode } from './SvgNode';
import { findNode } from '../../utils/NodeUtils'
import { addInSvgSpace, transformPointToSvgSpace } from '../../utils/SvgUtils'

class SvgRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grabFrom: [0, 0],
      grabTo: [0, 0],
      grabMode: null,
      grabNodeId: -1,
      lastPos: [0, 0]
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

    let grabNodeOutput = event.target.getAttribute("data-output-name");
    let grabNodeId = -1;
    let parent = event.target.parentElement;
    while(!(parent instanceof SVGSVGElement)) {
      if(parent.hasAttribute("data-node-id")) {
        grabNodeId = parent.getAttribute("data-node-id")|0;
        break;
      }
      parent = parent.parentElement;
    }

    this.setState({
      grabNodeId,
      grabNodeOutput,
      grabMode: "connector",
      grabTo: c,
      grabFrom: c,
      lastPos: [event.clientX, event.clientY]
    });
  }

  onElementMouseDown(event, node) {
    this.setState({
      grabMode: "element",
      grabNodeId: node.id,
      lastPos: [event.clientX, event.clientY]
    })
  }

  onMouseMove(event) {
    if(this.state.grabMode != null) {
      let dx = event.clientX - this.state.lastPos[0];
      let dy = event.clientY - this.state.lastPos[1];
      this.setState({
        lastPos: [event.clientX, event.clientY]
      });

      if(this.state.grabMode === "element") {
        let node = this.props.graph.find(node => node.id === this.state.grabNodeId);
        let newPos = addInSvgSpace(node.pos, [dx, dy], this.svg)
        this.props.setNodeLocation(this.state.grabNodeId, newPos);
      } else if(this.state.grabMode === "connector") {
        let grabTo = addInSvgSpace(this.state.grabTo, [dx, dy], this.svg)
        this.setState({ grabTo });
      }
    }
  }

  onConnectorMouseUp(event) {
    let target = event.target;
    if(target.hasAttribute("data-input-name")) {
      let nodeId = -1;
      let parent = target.parentElement;
      let inputName = target.getAttribute("data-input-name");
      while(!(parent instanceof SVGSVGElement)) {
        if(parent.hasAttribute("data-node-id")) {
          nodeId = parent.getAttribute("data-node-id")|0;
          break;
        }
        parent = parent.parentElement;
      }
      if(nodeId != -1 && nodeId != this.state.grabNodeId) {
        this.props.connectNodes(
          {
            id: this.state.grabNodeId,
            name: this.state.grabNodeOutput
          },
          {
            id: nodeId,
            name: inputName
          }
        );
      }
    }
    this.onMouseUp();
  }

  onMouseUp(event) {
    this.setState({
      grabMode: null,
      grabNodeId: null
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
    let { graph, connections } = this.props;
    let { grabTo, grabFrom } = this.state;
    let circles = graph.map(node => <SvgNode key={node.id} node={node}  onConnectorMouseUp={this.onConnectorMouseUp} onConnectorMouseDown={this.onConnectorMouseDown} onElementMouseDown={(event) => this.onElementMouseDown(event, node)}/>);
    let lines = connections.map(connection => {
      let node1 = graph.find(node => node.id === connection[0]);
      let node2 = graph.find(node => node.id === connection[1]);
      let key = `${node1.pos[0]}${node1.pos[1]}${node2.pos[0]}${node2.pos[1]}`;
      return <line key={key} x1={node1.pos[0]} y1={node1.pos[1]} x2={node2.pos[0]} y2={node2.pos[1]} strokeWidth="2" stroke="black"/>
    });
    let connectorLine = null;
    if(this.state.grabMode === "connector") {
      connectorLine = <line className="connector-line" x1={grabFrom[0]} y1={grabFrom[1]} x2={grabTo[0]} y2={grabTo[1]} stroke="black" strokeWidth="2" />
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
  connections: PropTypes.array.isRequired,
  createNewNode: PropTypes.func.isRequired,
  setNodeLocation: PropTypes.func.isRequired,
  connectNodes: PropTypes.func.isRequired
}

export default SvgRenderer;
