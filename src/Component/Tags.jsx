import React, { Component, PropTypes } from 'react'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'
import TagItem from './common/TagItem'
import LoadMore from './common/LoadMore'

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
        callBack: (index) => this.filterCallBack(index)
      },{
        index: 1,
        name: '系统预设',
        key: 'type',
        value: 0,
        callBack: (index) => this.filterCallBack(index)
      },{
        index: 2,
        name: '自定义',
        key: 'type',
        value: 1,
        callBack: (index) => this.filterCallBack(index)
      },{
        index: 3,
        name: '博文生成',
        key: 'type',
        value: 2,
        callBack: (index) => this.filterCallBack(index)
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
      filterIndex: 0,
      list: [],
      page: 0,
      typeList: []
    };
  }
  filterCallBack(index) {
    this.setState({
      filterIndex: index
    });
  }
  refreshList() {
    var param = {};
    this.props.currentFilters.forEach((filter, i) => {
      if (filter.index === this.state.filterIndex && filter.key) {
        param[filter.key.toLowerCase()] = filter.value;
      }
    });
    param.pagenum = this.state.page;
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
    this.refreshList();
  }
  componentWillUnmount() {
    this.props.dispatch(setTagScrollPos(document.body.scrollTop));
  }
  pagePre() {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1
      });
    }
  }
  pageNext() {
    if (this.props.fetchInfo.fetchStat === 0) {
      this.setState({
        page: this.state.page + 1
      });
    }
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'tag-container wide' : 'tag-container'}>
        {(this.props.fetchInfo['TagList'] || []).map((tag, index) => {
          return <TagItem key={tag._id} tag={tag} typeList={this.state.typeList} onDelete={id => this.deleteTag(id)} propChange={(key, url) => this.tagPropChange(key, url)} settingStatus={this.props.settingStatus}/>
        })}
        <LoadMore fetchStatus={this.props.fetchInfo.fetchStat} pageNum={this.state.page + 1} callPre={() => this.pagePre()} callNext={() => this.pageNext()}/>
      </div>
    );
  }
}

Tags.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  currentFilters: PropTypes.array.isRequired,
  tagScrollPos: PropTypes.number.isRequired,
  fetchInfo: PropTypes.object.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    settingStatus: state.settingStatus,
    currentFilters: state.currentFilters,
    tagScrollPos: state.tagScrollPos,
    fetchInfo: state.requestDatas
  };
}

export default connect(select)(Tags);
