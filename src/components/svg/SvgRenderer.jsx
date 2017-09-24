import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './SvgRenderer.less';
import { SvgNode } from './SvgNode';
import { findNode } from '../../utils/NodeUtils'

class SvgRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      isDragging: false,
      dragNodeId: null
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.setSvg = this.setSvg.bind(this);
    this.onElementMouseDown = this.onElementMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    let width = this.svg.width.baseVal.value;
    let height = this.svg.height.baseVal.value;
    this.setState({
      x: width/2.0,
      y: height/2.0,
      width: width/2.0,
      height: height/2.0,
      lastX: 0,
      lastY: 0
    });
  }

  handleDrop(event) {
    event.preventDefault();
    console.log("Item dropped");
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

  onElementMouseDown(event, node) {
    this.setState({
      isDragging: true,
      dragNodeId: node.id,
      lastX: event.clientX,
      lastY: event.clientY
    })
  }

  onMouseMove(event) {
    if(this.state.isDragging) {
      let dx = event.clientX - this.state.lastX;
      let dy = event.clientY - this.state.lastY;
      this.setState({
        lastX: event.clientX,
        lastY: event.clientY
      });
      let node = findNode(this.props.graph, this.state.dragNodeId);
      this.point.x = node.pos[0];
      this.point.y = node.pos[1];
      let oldCoords = this.point.matrixTransform(this.svg.getScreenCTM());
      this.point.x = oldCoords.x + dx;
      this.point.y = oldCoords.y + dy;
      let newCoords = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
      this.props.setNodeLocation(this.state.dragNodeId, [newCoords.x, newCoords.y]);
    }
  }

  onMouseUp(event) {
    this.setState({
      isDragging: false,
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
    let { x, y, width, height } = this.state;
    let circles = nodes.map(node => <SvgNode key={node.id} node={node} onElementMouseDown={(event) => this.onElementMouseDown(event, node)} onMouseUp={this.onMouseUp} />);
    let lines = connections.map(connection => {
      let node1 = nodes[connection[0]];
      let node2 = nodes[connection[1]];
      let key = `${node1.pos[0]}${node1.pos[1]}${node2.pos[0]}${node2.pos[1]}`;
      return <line key={key} x1={node1.pos[0]} y1={node1.pos[1]} x2={node2.pos[0]} y2={node2.pos[1]} strokeWidth="2" stroke="black"/>
    });
    let w = 200;
    let viewBox = `-${w} -${w} ${w*2} ${w*2}`;
    //TODO: Set svg viewBox depending on svg size
    return (
      <svg ref={this.setSvg} onDrop={this.handleDrop} onDragOver={this.preventEvent} onDragEnter={this.preventEvent} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} viewBox={viewBox}>
      {circles}
      {lines}
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
