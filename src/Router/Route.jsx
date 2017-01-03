import React, {Component, PropTypes} from 'react'
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router'

import Roots from '../Component/Frame';
import Index from '../Component/Index';

const history = process.env.NODE_ENV != 'production' ? browserHistory : hashHistory;

const BlogEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/BlogEdit').default)
    },'BlogEdit')
};

const Tags = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Tags').default)
    },'Tags')
};

const Comments = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Comments').default)
    },'Comments')
};

const Users = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Users').default)
    },'Users')
};

const RouteConfig = (
  <Router history={ history }>
    <Route path="/" component={ Roots }>
      <IndexRoute component={ Index } />
      <Route path="blogs" component={ Index } />
      <Route path="blogs/edit(/:id)" getComponent={ BlogEdit } />
      <Route path="tags" getComponent={ Tags } />
      <Route path="comments" getComponent={ Comments } />
      <Route path="users" getComponent={ Users } />
      <Redirect from="*" to="/" />
    </Route>
  </Router>
);

export default RouteConfig;
