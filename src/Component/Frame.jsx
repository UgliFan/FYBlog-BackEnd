import React, { Component, PropTypes } from 'react'
import pureRender from 'pure-render-decorator'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { System } from '../Libs/Config'
import { Tool } from '../Libs/Tool'

import * as Action from '../Redux/Action/Index'

import Header from './common/Header'
import SideBar from './common/SideBar'

//@pureRender
class Frame extends Component {
  filterChange(filter) {
    filter.callBack && filter.callBack();
  }
  toolAction(action, dispatch) {
    dispatch(Action[action]());
  }
  render() {
    const { dispatch, sideBarStatus, menuStatus, toolBar } = this.props;
    return (
      <div>
        <Header
          menuList={menuStatus}
          userInfo={{ icon: '/images/404.jpg' }}
          sideBarStatus={sideBarStatus}
          sideBarTigger={() => dispatch(Action.toggleSideBar())}
          toolBar={toolBar}
          toolAction={action => this.toolAction(action, dispatch)}/>
        <SideBar menuList={menuStatus} status={sideBarStatus} onChange={index => {
          dispatch(Action.changeMenu(index)) && (System ? dispatch(Action.toggleSideBar()) : null);
        }}/>
        {this.props.children}
        <div className={'filters-bar' + (sideBarStatus ? ' wide' : '')}>
          {this.props.currentFilters.map((filter, index) => {
            return (
              <div
                className={'filter-item' + (filter.on ? ' on': '')}
                key={index} onClick={() => dispatch(Action.selectFilter(index)) && this.filterChange(filter)}>
                <i className="iconfont icon-filter"></i>
                {filter.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Frame.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  menuStatus: PropTypes.array.isRequired,
  currentFilters: PropTypes.array.isRequired,
  toolBar: PropTypes.array.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    menuStatus: state.menuStatus,
    currentFilters: state.currentFilters,
    toolBar: state.currentToolBar
  };
}

export default connect(select)(Frame);
