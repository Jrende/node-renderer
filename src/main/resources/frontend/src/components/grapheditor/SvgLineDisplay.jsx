import React from 'react';
import ConnectorLine from './ConnectorLine';
import { transformPointToSvgSpace } from '../../utils/SvgUtils';

function getCenter(r) {
  return [
    r.x + (r.width / 2),
    r.y + (r.height / 2)
  ];
}

class SvgLineDisplay extends React.Component {
  constructor() {
    super();
    this.setSvg = this.setSvg.bind(this);
  }

  generateConnectionLines() {
    if(this.svg === undefined || this.props.elementRects === undefined) {
      return [];
    }
    let lines = this.props.elementRects.map((connection) => {
      let from = transformPointToSvgSpace(
        getCenter(connection.fromRect),
        this.svg, this.point);

      let to = transformPointToSvgSpace(
        getCenter(connection.toRect),
        this.svg, this.point);
      return {
        from,
        to,
        key: connection.key
      };
    });
    return lines;
  }

  setSvg(svg) {
    if(svg !== undefined && svg !== null) {
      this.svg = svg;
      this.point = svg.createSVGPoint();
      this.setState(this.state);
    }
    this.props.setSvg(svg);
  }


  render() {
    let {
      grabTo,
      grabFrom,
      grabMode,
    } = this.props;
    let domConnections = this.generateConnectionLines();
    return (
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
    );
  }
}

export default SvgLineDisplay;

