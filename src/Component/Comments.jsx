import React, { Component, PropTypes } from 'react'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import { changeMenu, setFilters, setToolBar } from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

import CommentRow from './common/CommentRow'

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
      filters: [],
      toolBar: [{
        type: 'reducer',
        name: '设置',
        icon: 'iconfont icon-settings',
        callBack: 'toggleSetting'
      }],
      list: []
    };
  }
  componentWillMount() {
    this.props.dispatch(changeMenu(3));
    this.props.dispatch(setFilters(this.state.filters));
    this.props.dispatch(setToolBar(this.state.toolBar));
    if (this.props.params.topic_id) {
      this.setState({
        topicId: this.props.params.topic_id
      });
      this.refreshList(this.props.params.topic_id);
    }
  }
  refreshList(topicId) {
    if (topicId) {
      this.props.dispatch(fetchGets(`/comment/page/${topicId}`, {}, (list) => {
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
    this.refreshList(topicId);
  }
  deleteComment(id) {
    Tool.get('/token').then(data => {
      Tool.post(`/comment/remove/${id}`,{token: data.token}).then(data => {
        this.refreshList(this.state.topicId);
      });
    });
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'comm-container wide' : 'comm-container'}>
        <TopicIdInput initValue={this.props.params.topic_id} submitCallBack={topicId => this.submitCallBack(topicId)} />
        {this.state.list.length > 0
          ? this.state.list.map((comment, index) => {
            return <CommentRow key={index} comment={comment} onDelete={id => this.deleteComment(id)} settingStatus={this.props.settingStatus}/>
          })
          : this.state.topicId ? <NoComment /> : null
        }
      </div>
    );
  }
}

Comments.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  currentFilters: PropTypes.array.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle,
    settingStatus: state.settingStatus,
    currentFilters: state.currentFilters
  };
}

export default connect(select)(Comments);
