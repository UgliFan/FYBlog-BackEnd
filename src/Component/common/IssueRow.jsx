import React, { Component, PropTypes } from 'react'
import { Tool } from '../../Libs/Tool'

class ReplyRow extends Component {
  render() {
    const { reply } = this.props;
    return (
      <div className="reply-row">
        <div className="reply-title">
          <span className="reply-name">{reply.name}</span>
          <span className="reply-date">{Tool.formateDate(reply.reply_at)}</span>
        </div>
        <div className="reply-content">{reply.content}</div>
      </div>
    );
  }
}
ReplyRow.propTypes = {
  reply: PropTypes.object.isRequired
};

export default class IssueRow extends Component {
  constructor() {
    super();
    this.state = {
      issueType: [{
        name: '问答',
        className: 'issue-type issue-ask'
      }, {
        name: '改进意见',
        className: 'issue-type issue-optimize'
      }, {
        name: 'Bug反馈',
        className: 'issue-type issue-bug'
      }, {
        name: '情感交流',
        className: 'issue-type issue-communicate'
      }],
      issueState: [{
        name: '打开中',
        className: 'issue-state open'
      }, {
        name: '已解决',
        className: 'issue-state solve'
      }, {
        name: '已拒绝',
        className: 'issue-state close'
      }],
      replyOpen: false
    };
  }
  toggleReplyState() {
    this.setState({
      replyOpen: !this.state.replyOpen
    });
  }
  render() {
    const { issue, onDelete, onClose } = this.props;
    return (
      <div className="issue-row">
        <div className="issue-title">
          <span className={this.state.issueType[issue.type].className}>{this.state.issueType[issue.type].name}</span>
          <span className="issue-zan"><i className="iconfont icon-appreciate"></i>{Tool.numberFormat(issue.zan_count)}</span>
          <span className="issue-date">发表于 {Tool.formateDate(issue.create_at)}</span>
          <span className="issue-author">{issue.author}</span>
        </div>
        <div className="issue-content">{issue.content}</div>
        <div className="issue-footer">
          <div className={this.state.issueState[issue.state].className}>{this.state.issueState[issue.state].name}</div>
          <div className="issue-close" onClick={() => onClose(issue._id)}><i className="iconfont icon-settings"></i>关闭</div>
          <div className="issue-delete" onClick={() => onDelete(issue._id)}><i className="iconfont icon-delete"></i>删除</div>
          <div onClick={() => this.toggleReplyState()} className="issue-reply"><i className={'iconfont' + (this.state.replyOpen ? ' icon-fold' : ' icon-unfold')}></i>{this.state.replyOpen ? '收起' : '展开'}评论</div>
        </div>
        <div className={'issue-reply-list' + (this.state.replyOpen ? ' open' : ' close')}>
          {issue.reply.map((Reply, index) => {
            return <ReplyRow reply={Reply} key={index}/>
          })}
        </div>
      </div>
    );
  }
}

IssueRow.propTypes = {
  issue: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
