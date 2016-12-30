import React, {Component, PropTypes} from 'react'
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router'

import Index from '../Component/Index';

class Roots extends Component {
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}

const history = process.env.NODE_ENV != 'production' ? browserHistory : hashHistory;


const RouteConfig = (
  <Router history={ history }>
    <Route path="/" component={ Roots }>
      <IndexRoute component={ Index } />
      <Redirect from="*" to="/" />
    </Route>
  </Router>
);

export default RouteConfig;
