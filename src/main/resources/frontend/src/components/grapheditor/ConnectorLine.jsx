import React from 'react';

const ConnectorLine = ({ from, to }) => (
  <line
    className="connector-line"
    x1={from[0]}
    y1={from[1]}
    x2={to[0]}
    y2={to[1]}
    stroke="black"
    strokeWidth="2"
  />
);

export default ConnectorLine;
