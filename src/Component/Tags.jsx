import React, { Component, PropTypes } from 'react'
import pureRender from 'pure-render-decorator'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import {
  setFilters,
  setToolBar
} from '../Redux/Action/Index'

//@pureRender
class Tags extends Component {
  constructor() {
    super();
    this.state = {
      filters: [{name:'全部'},{name: '系统', on: true},{name: '自定义'}]
    };
  }
  componentWillMount() {
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar([]));
  }
  render() {
    return (
      <div></div>
    );
  }
}

Tags.propTypes = {
};

function select(state) {
  return {
  };
}

export default connect(select)(Tags);
