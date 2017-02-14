import React, {Component, PropTypes} from 'react'
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory } from 'react-router'

import Roots from '../Component/Frame';
import Index from '../Component/Index';

const history = hashHistory;

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

const TagEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/TagEdit').default)
    },'TagEdit')
};

const Files = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Files').default)
    },'Files')
};

const FileEdit = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/FileEdit').default)
    },'FileEdit')
};

const Comments = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../Component/Comments').default)
    },'Comments')
};

const Issues = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../Component/Issues').default)
  },'Issues')
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
      <Route path="tags/edit(/:id)" getComponent={ TagEdit } />
      <Route path="files" getComponent={ Files } />
      <Route path="file/edit(/:id)" getComponent={ FileEdit } />
      <Route path="comments(/:topic_id)" getComponent={ Comments } />
      <Route path="Issues" getComponent={ Issues } />
      <Route path="users" getComponent={ Users } />
      <Redirect from="*" to="/" />
    </Route>
  </Router>
);

export default RouteConfig;
