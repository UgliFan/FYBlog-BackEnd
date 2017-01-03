import React, { Component, PropTypes } from 'react'
import pureRender from 'pure-render-decorator'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import { changeMenu, setFilters, setToolBar } from '../Redux/Action/Index'

//@pureRender
class Comments extends Component {
  constructor() {
    super();
    this.state = {
      filters: []
    };
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(3));
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar([]));
  }
  render() {
    return (
      <div></div>
    );
  }
}

Comments.propTypes = {
};

function select(state) {
  return {
  };
}

export default connect(select)(Comments);
