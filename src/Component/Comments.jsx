import React, { Component, PropTypes } from 'react'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
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

import CommentRow from './common/CommentRow'
import LoadMore from './common/LoadMore'

class TopicIdInput extends Component {
  constructor() {
    super();
    this.state = { id: '' };
  }
  inputChange(event) {
    this.setState({
      id: event.target.value
    });
  }
  inputSubmit() {
    if (this.state.id) {
      this.props.submitCallBack(this.state.id);
    }
  }
  componentWillMount() {
    if (this.props.initValue) {
      this.setState({
        id: this.props.initValue
      });
    }
  }
  render() {
    return (
      <div className='search-input'>
        <i className='iconfont icon-search'></i>
        <input type='text' value={this.state.id} onChange={event => this.inputChange(event)} placeholder='请输入博文ID来查询对应的评论' />
        <button onClick={() => this.inputSubmit()}>提交</button>
      </div>
    );
  }
}

class NoComment extends Component {
  render() {
    return (
      <div className='no-comment'><i className='iconfont icon-warn'></i>该博文没有相关评论</div>
    );
  }
}

class Comments extends Component {
  constructor() {
    super();
    this.state = {
      topicId: '',
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
    this.props.dispatch(changeMenu(3));
    this.props.dispatch(setFilters([]));
    this.props.dispatch(setToolBar(this.state.toolBar));
    if (this.props.params.topic_id) {
      this.setState({
        topicId: this.props.params.topic_id
      });
    }
  }
  componentDidUpdate() {
    this.refreshList();
  }
  refreshList() {
    if (this.state.topicId) {
      var params = {};
      params.pagenum = this.state.page;
      this.props.dispatch(fetchGets(`/comment/page/${this.state.topicId}`, params, (list) => {
        this.setState({
          list: list
        });
      }, 'CommentList'));
    }
  }
  submitCallBack(topicId) {
    this.setState({
      topicId: topicId
    });
  }
  deleteComment(id) {
    this.props.dispatch(setConfirmDialog({
      title: '确认删除？',
      confirmCallback: () => {
        this.props.dispatch(closeConfirmDialog());
        Tool.get('/token').then(data => {
          Tool.post(`/comment/remove/${id}`,{token: data.token}).then(data => {
            this.props.dispatch(showMessage({
              type: data.code === 0 ? 'success' : 'warn',
              text: data.msg
            }));
            if (data.code === 0) {
              this.refreshList(this.state.topicId);
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
      <div className={this.props.sideBarStatus ? 'comm-container wide' : 'comm-container'}>
        <TopicIdInput initValue={this.props.params.topic_id} submitCallBack={topicId => this.submitCallBack(topicId)} />
        {(this.props.fetchInfo['CommentList'] || []).length > 0
          ? (this.props.fetchInfo['CommentList'] || []).map((comment, index) => {
            return <CommentRow key={index} comment={comment} onDelete={id => this.deleteComment(id)} settingStatus={this.props.settingStatus}/>
          })
          : this.state.topicId ? <NoComment /> : null
        }
        {this.state.topicId ? <LoadMore fetchStatus={this.props.fetchInfo.fetchStat} pageNum={this.state.page + 1} callPre={() => this.pagePre()} callNext={() => this.pageNext()}/> : null}
      </div>
    );
  }
}

Comments.propTypes = {
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

export default connect(select)(Comments);
