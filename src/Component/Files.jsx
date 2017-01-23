import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tool } from '../Libs/Tool'
import FileRow from './common/FileRow'
import LoadMore from './common/LoadMore'

import {
  changeMenu,
  setFilters,
  setToolBar,
  showMessage,
  setConfirmDialog,
  closeConfirmDialog } from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

class BreadChumb extends Component {
  breadClick(index, bread) {
    if (index !== this.props.bread.length - 1) {
      this.props.changeDepth(bread.position, bread._id);
    }
  }
  render() {
    return (
      <div className="bread-crumb">
        {this.props.bread.map((item, i) => {
          return <a key={item._id} className="bread-item" onClick={() => this.breadClick(i, item)}>{item.name}</a>;
        })}
      </div>
    );
  }
}
BreadChumb.propTypes = {
  bread: PropTypes.array.isRequired,
  changeDepth: PropTypes.func.isRequired
};

class Files extends Component {
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
        name: '图片',
        key: 'type',
        value: 'p',
        callBack: (index) => this.filterCallBack(index)
      },{
        index: 2,
        name: '文件夹',
        key: 'type',
        value: 'f',
        callBack: (index) => this.filterCallBack(index)
      },{
        index: 3,
        name: '其它',
        key: 'type',
        value: 'o',
        callBack: (index) => this.filterCallBack(index)
      }],
      toolBar: [{
        type: 'link',
        name: '新增',
        icon: 'iconfont icon-add',
        callBack: '/file/edit'
      }],
      filterIndex: 0,
      list: [],
      page: 0,
      pid: '58845a31c52046b8ee7da9cb',
      position: '58845a31c52046b8ee7da9cb',
      breadCrumb: []
    };
  }
  filterCallBack(index) {
    this.setState({
      filterIndex: index
    });
  }
  refreshList() {
    var param = {};
    this.props.currentFilters.forEach((filter) => {
      if (filter.index === this.state.filterIndex && filter.key) {
        param[filter.key.toLowerCase()] = filter.value;
      }
    });
    param.pagenum = this.state.page;
    param.pid = this.state.pid;
    this.props.dispatch(fetchGets('/file/page', param, (list) => {
      this.setState({
        list: list
      });
    }, 'FileList'));
  }
  refreshBread() {
    this.props.dispatch(fetchGets('/file/breadcrumb', {path: this.state.position}, (list) => {
      list = Object.prototype.toString.call(list) === '[object Array]' ? list : (list._id ? [list]: []);
      this.setState({
        breadCrumb: list
      });
    }, 'FileBread'));
  }
  deleteTag(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认删除？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          Tool.post(`/file/remove/${id}`,{token: data.token}).then(data => {
            this.props.dispatch(showMessage({
              type: data.code === 0 ? 'success' : 'warn',
              text: data.msg
            }));
            if (data.code === 0) {
              this.refreshList();
            }
          }).catch(() => {
            this.props.dispatch(showMessage({
              type: 'danger',
              text: '网络错误，请稍后重试'
            }));
          });
        }).catch(() => {
          this.props.dispatch(showMessage({
            type: 'danger',
            text: '网络错误，请稍后重试'
          }));
        });
      }
    }));
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(5));
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar(this.state.toolBar));
  }
  componentDidUpdate() {
    this.refreshBread();
    this.refreshList();
  }
  deleteFile(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认删除？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          let postData ={
            token: data.token
          };
          Tool.post('/file/remove/' + id, postData).then(data => {
            this.props.dispatch(showMessage({
              type: data.code === 0 ? 'success' : 'warn',
              text: data.msg
            }));
            if (data.code === 0) {
              this.refreshList();
            }
          }).catch(() => {
            this.props.dispatch(showMessage({
              type: 'danger',
              text: '网络错误，请稍后重试'
            }));
          });
        }).catch(() => {
          this.props.dispatch(showMessage({
            type: 'danger',
            text: '网络错误，请稍后重试'
          }));
        });
      }
    }));
  }
  downloadFile(id) {
    window.location.href = '/file/download/' + id;
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
  changeDepth(path, pid) {
    this.setState({
      page: 0,
      pid: pid,
      position: path
    });
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'file-container wide' : 'file-container'}>
        <BreadChumb bread={this.state.breadCrumb} changeDepth={(path, pid) => this.changeDepth(path, pid)}/>
        {(this.props.fetchInfo['FileList'] || []).map((file, index) => {
          return <FileRow
            key={file._id}
            file={file}
            settingStatus={this.props.settingStatus}
            changeDepth={(path, pid) => this.changeDepth(path, pid)}
            download={(id) => this.downloadFile(id)}
            deleteFile={(id) => this.deleteFile(id)}/>;
        })}
        {(this.props.fetchInfo['FileList'] || []).length === 0 ? <div className="file-empty">该文件夹下没有内容哦</div> : null}
        <LoadMore fetchStatus={this.props.fetchInfo.fetchStat} pageNum={this.state.page + 1} callPre={() => this.pagePre()} callNext={() => this.pageNext()}/>
      </div>
    );
  }
}

Files.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  currentFilters: PropTypes.array.isRequired,
  fetchInfo: PropTypes.object.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    settingStatus: state.settingStatus,
    currentFilters: state.currentFilters,
    fetchInfo: state.requestDatas
  };
}

export default connect(select)(Files);
