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
import Message from './common/Message'
import Confirm from './common/Confirm'

//@pureRender
class Frame extends Component {
  filterChange(filter) {
    filter.callBack && filter.callBack(filter.index);
  }
  toolAction(action, dispatch) {
    dispatch(Action[action]());
  }
  hideMessage(dispatch) {
    dispatch(Action.hideMessage());
  }
  confirmCancel(dispatch) {
    dispatch(Action.closeConfirmDialog());
  }
  render() {
    const { dispatch, sideBarStatus, menuStatus, toolBar, msgInfo, confirmConf } = this.props;
    return (
      <div>
        <Header
          menuList={menuStatus}
          userInfo={{ icon: '/images/404.jpg' }}
          sideBarStatus={sideBarStatus}
          sideBarTigger={() => dispatch(Action.toggleSideBar())}
          toolBar={toolBar}
          toolAction={action => this.toolAction(action, dispatch)}/>
        <SideBar menuList={menuStatus} status={sideBarStatus} onChange={() => (System ? dispatch(Action.toggleSideBar()) : null)}/>
        {this.props.children}
        <div className={'filters-bar' + (sideBarStatus ? ' wide' : '')}>
          {this.props.currentFilters.map((filter, index) => {
            return (
              <div
                className={'filter-item' + (filter.on ? ' on': '')}
                key={index} onClick={() => dispatch(Action.selectFilter(filter.index)) && this.filterChange(filter)}>
                <i className="iconfont icon-filter"></i>
                {filter.name}
              </div>
            );
          })}
        </div>
        <Message info={msgInfo} msgHide={() => this.hideMessage(dispatch)}/>
        { confirmConf.title ? <Confirm config={confirmConf} onCancel={() => this.confirmCancel(dispatch)}/> : null }
      </div>
    );
  }
}

Frame.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  menuStatus: PropTypes.array.isRequired,
  currentFilters: PropTypes.array.isRequired,
  toolBar: PropTypes.array.isRequired,
  msgInfo: PropTypes.object.isRequired,
  confirmConf: PropTypes.object.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    menuStatus: state.menuStatus,
    currentFilters: state.currentFilters,
    toolBar: state.currentToolBar,
    msgInfo: state.messageInfo,
    confirmConf: state.confirmInfo
  };
}

export default connect(select)(Frame);
