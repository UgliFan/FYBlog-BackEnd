import React, { Component, PropTypes } from 'react'
import pureRender from 'pure-render-decorator'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import UserRow from './common/UserRow'

import { changeMenu, setFilters, setToolBar } from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

//@pureRender
class Users extends Component {
  constructor() {
    super();
    this.state = {
      filters: [],
      toolBar: [{
        type: 'reducer',
        name: '设置',
        icon: 'iconfont icon-settings',
        callBack: 'toggleSetting'
      }],
      list: [],
      groupList: []
    };
  }
  refreshList() {
    this.props.dispatch(fetchGets('/user/list', {}, (list) => {
      this.setState({
        list: list
      });
    }, 'UserList'));
  }
  propChange(key, url) {
    Tool.get('/token').then(data => {
      let postData ={
        token: data.token
      };
      Tool.post(url + '/' + key, postData).then(data => {
        this.refreshList();
      }).catch(err => {
        console.log('error', err);
      });
    }).catch(err => {
      console.log('get Token error', err);
    });
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(4));
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar(this.state.toolBar));
    this.props.dispatch(fetchGets('/group/list', {}, (list) => {
      this.setState({
        groupList: list
      });
    }, 'GroupList'));
    this.refreshList();
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'users-container wide' : 'users-container'}>
        {this.state.list.map((userInfo, index) => {
          return <UserRow key={userInfo._id} user={userInfo} settingStatus={this.props.settingStatus} propChange={(key, url) => this.propChange(key, url)} groupList={this.state.groupList}/>
        })}
      </div>
    );
  }
}

Users.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  settingStatus: PropTypes.bool.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    settingStatus: state.settingStatus
  };
}

export default connect(select)(Users);
