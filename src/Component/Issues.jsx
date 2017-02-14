import React, { Component, PropTypes } from 'react'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { Tool } from '../Libs/Tool'

import {
  changeMenu,
  setFilters,
  setToolBar,
  showMessage,
  setConfirmDialog,
  closeConfirmDialog
} from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

import IssueRow from './common/IssueRow'
import LoadMore from './common/LoadMore'

class Issues extends Component {
  constructor() {
    super();
    this.state = {
      toolBar: [{
        type: 'reducer',
        name: '设置',
        icon: 'iconfont icon-settings',
        callBack: 'toggleSetting'
      }],
      list: [],
      page: 0
    };
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(6));
    this.props.dispatch(setFilters([]));
    this.props.dispatch(setToolBar(this.state.toolBar));
    this.refreshList();
  }
  refreshList() {
    var params ={
      pagenum: this.state.page
    };
    this.props.dispatch(fetchGets(`/issue/list`, params, (list) => {
      this.setState({
        list: list
      });
    }, 'IssuesList'));
  }
  closeIssue(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认关闭ISSUE？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          let postData ={
            token: data.token
          };
          Tool.post(`/issue/close/${id}`, postData).then(data => {
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
  deleteIssue(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认删除？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          Tool.post(`/issue/remove/${id}`,{token: data.token}).then(data => {
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
      <div className={this.props.sideBarStatus ? 'issue-container wide' : 'issue-container'}>
        {(this.props.fetchInfo['IssuesList'] || []).length > 0
          ? (this.props.fetchInfo['IssuesList'] || []).map((Issue, index) => {
          return <IssueRow key={index} issue={Issue} onDelete={id => this.deleteIssue(id)} onClose={id => this.closeIssue(id)}/>
        }) : null
        }
        <LoadMore fetchStatus={this.props.fetchInfo.fetchStat} pageNum={this.state.page + 1} callPre={() => this.pagePre()} callNext={() => this.pageNext()}/>
      </div>
    );
  }
}

Issues.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  currentFilters: PropTypes.array.isRequired,
  fetchInfo: PropTypes.object.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    currentFilters: state.currentFilters,
    fetchInfo: state.requestDatas
  };
}

export default connect(select)(Issues);
