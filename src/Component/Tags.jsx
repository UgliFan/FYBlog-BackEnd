import React, { Component, PropTypes } from 'react'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'
import TagItem from './common/TagItem'

import {
  changeMenu,
  setFilters,
  setToolBar,
  setTagScrollPos,
  showMessage,
  setConfirmDialog,
  closeConfirmDialog } from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

class Tags extends Component {
  constructor() {
    super();
    this.state = {
      filters: [{
        index: 0,
        name:'全部',
        on:true,
        callBack: (index) => this.refreshList(index)
      },{
        index: 1,
        name: '系统预设',
        key: 'type',
        value: 0,
        callBack: (index) => this.refreshList(index)
      },{
        index: 2,
        name: '自定义',
        key: 'type',
        value: 1,
        callBack: (index) => this.refreshList(index)
      },{
        index: 3,
        name: '博文生成',
        key: 'type',
        value: 2,
        callBack: (index) => this.refreshList(index)
      }],
      toolBar: [{
        type: 'link',
        name: '新增',
        icon: 'iconfont icon-add',
        callBack: '/tags/edit'
      },{
        type: 'reducer',
        name: '设置',
        icon: 'iconfont icon-settings',
        callBack: 'toggleSetting'
      }],
      list: [],
      typeList: []
    };
  }
  refreshList(index) {
    var param = {};
    this.props.currentFilters.forEach((filter, i) => {
      if (filter.index === index && filter.key) {
        param[filter.key.toLowerCase()] = filter.value;
      }
    });
    this.props.dispatch(setTagScrollPos(document.body.scrollTop));
    this.props.dispatch(fetchGets('/tag/page', param, (list) => {
      this.setState({
        list: list
      });
    }, 'TagList'));
  }
  deleteTag(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认删除？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          Tool.post(`/tag/remove/${id}`,{token: data.token}).then(data => {
            this.props.dispatch(showMessage({
              type: data.code === 0 ? 'success' : 'warn',
              text: data.msg
            }));
            if (data.code === 0) {
              this.refreshList();
            }
          }).catch(err => {
            this.props.dispatch(showMessage({
              type: 'danger',
              text: '网络错误，请稍后重试'
            }));
          });
        }).catch(err => {
          this.props.dispatch(showMessage({
            type: 'danger',
            text: '网络错误，请稍后重试'
          }));
        });
      }
    }));
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(2));
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar(this.state.toolBar));
    this.props.dispatch(fetchGets('/tag_type/list', {}, (list) => {
      this.setState({
        typeList: list
      });
    }, 'TypeList'));
    this.refreshList();
  }
  tagPropChange(key, url) {
    this.props.dispatch(setConfirmDialog({
      title: '确认修改属性？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          let postData ={
            token: data.token
          };
          Tool.post(url + '/' + key, postData).then(data => {
            this.props.dispatch(showMessage({
              type: data.code === 0 ? 'success' : 'warn',
              text: data.msg
            }));
            if (data.code === 0) {
              this.refreshList();
            }
          }).catch(err => {
            this.props.dispatch(showMessage({
              type: 'danger',
              text: '网络错误，请稍后重试'
            }));
          });
        }).catch(err => {
          this.props.dispatch(showMessage({
            type: 'danger',
            text: '网络错误，请稍后重试'
          }));
        });
      }
    }));
  }
  componentDidUpdate() {
    document.body.scrollTop = this.props.tagScrollPos;
  }
  componentWillUnmount() {
    this.props.dispatch(setTagScrollPos(document.body.scrollTop));
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'tag-container wide' : 'tag-container'}>
        {this.state.list.map((tag, index) => {
          return <TagItem key={tag._id} tag={tag} typeList={this.state.typeList} onDelete={id => this.deleteTag(id)} propChange={(key, url) => this.tagPropChange(key, url)} settingStatus={this.props.settingStatus}/>
        })}
      </div>
    );
  }
}

Tags.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  currentFilters: PropTypes.array.isRequired,
  tagScrollPos: PropTypes.number.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    settingStatus: state.settingStatus,
    currentFilters: state.currentFilters,
    tagScrollPos: state.tagScrollPos
  };
}

export default connect(select)(Tags);
