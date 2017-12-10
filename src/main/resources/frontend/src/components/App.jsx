import React from 'react';
import Editor from '../containers/editor/Editor';
import Overview from '../containers/overview/Overview';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class App extends React.Component {
  render() {
    return [
      <Route exact path="/" component={Overview} key="overview" />,
      <Route path="/:id" component={Editor} key="editor" />
    ];
  }
}

