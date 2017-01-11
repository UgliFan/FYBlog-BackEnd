import React, { Component, PropTypes } from 'react'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import BlogRow from './common/BlogRow'
import LoadMore from './common/LoadMore'

import {
  changeMenu,
  setFilters,
  setToolBar,
  setIndexScrollPos,
  showMessage,
  setConfirmDialog,
  closeConfirmDialog
} from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'


class Main extends Component {
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
        name: '未锁',
        key: 'isOff',
        value: false,
        callBack: (index) => this.filterCallBack(index)
      },{
        index: 2,
        name: '已锁',
        key: 'isOff',
        value: true,
        callBack: (index) => this.filterCallBack(index)
      }],
      filterIndex: 0,
      toolBar: [{
        type: 'link',
        name: '新增',
        icon: 'iconfont icon-add',
        callBack: '/blogs/edit'
      },{
        type: 'reducer',
        name: '设置',
        icon: 'iconfont icon-settings',
        callBack: 'toggleSetting'
      }],
      list: [],
      page: 0
    };
  }
  deleteBlog(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认删除？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          Tool.post(`/blog/remove/${id}`,{token: data.token}).then(data => {
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
        });
      }
    }));
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
    this.props.dispatch(setIndexScrollPos(document.body.scrollTop));
    this.props.dispatch(fetchGets('/blog/page', param, (list) => {
      this.setState({
        list: list
      });
    }, 'BlogList'));
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(1));
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar(this.state.toolBar));
  }
  componentDidUpdate() {
    document.body.scrollTop = this.props.indexScrollPos;
    this.refreshList();
  }
  componentWillUnmount() {
    this.props.dispatch(setIndexScrollPos(document.body.scrollTop));
  }
  blogPropChange(key, url) {
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
      <div className={this.props.sideBarStatus ? 'blog-container wide' : 'blog-container'}>
        {(this.props.fetchInfo['BlogList'] || []).map((blog, index) => {
          return <BlogRow key={blog._id} blog={blog} onDelete={id => this.deleteBlog(id)} settingStatus={this.props.settingStatus} propChange={(key, url) => this.blogPropChange(key, url)}/>
        })}
        <LoadMore fetchStatus={this.props.fetchInfo.fetchStat} pageNum={this.state.page + 1} callPre={() => this.pagePre()} callNext={() => this.pageNext()}/>
      </div>
    );
  }
}

Main.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  currentFilters: PropTypes.array.isRequired,
  indexScrollPos: PropTypes.number.isRequired,
  fetchInfo: PropTypes.object.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    settingStatus: state.settingStatus,
    currentFilters: state.currentFilters,
    indexScrollPos: state.indexScrollPos,
    fetchInfo: state.requestDatas
  };
}

export default connect(select)(Main);
