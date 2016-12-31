import React, { Component, PropTypes } from 'react'
import pureRender from 'pure-render-decorator'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import BlogRow from './common/BlogRow'

import { setFilters, setToolBar } from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

//@pureRender
class Main extends Component {
  constructor() {
    super();
    this.state = {
      filters: [{name:'全部', on:true},{name: '解禁', isOff: false},{name: '下架', isOff: true}],
      toolBar: [{
        name: '新增',
        icon: 'iconfont icon-write',
        callBack: 'createBlog'
      },{
        name: '设置',
        icon: 'iconfont icon-settings',
        callBack: 'actionSetting'
      }],
      list: []
    };
  }
  componentWillMount() {
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar(this.state.toolBar));
    this.props.dispatch(fetchGets('/blog/page', {}, (list) => {
      this.setState({
        list: list
      });
    }, 'BlogList'));
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'container wide' : 'container'}>
        {
          this.state.list.map((blog, index) => {
            return <BlogRow blog={blog} />
          })
        }
      </div>
    );
  }
}

Main.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle
  };
}

export default connect(select)(Main);
