import React, {Component, PropTypes} from 'react'
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router'

import Roots from '../Component/Frame';
import Index from '../Component/Index';

const history = process.env.NODE_ENV != 'production' ? browserHistory : hashHistory;

const Tags = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Tags').default)
    },'Tags')
}

const RouteConfig = (
  <Router history={ history }>
    <Route path="/" component={ Roots }>
      <IndexRoute component={ Index } />
      <Route path="blogs" component={ Index } />
      <Route path="tags" getComponent={ Tags } />
      <Redirect from="*" to="/" />
    </Route>
  </Router>
);

export default RouteConfig;
