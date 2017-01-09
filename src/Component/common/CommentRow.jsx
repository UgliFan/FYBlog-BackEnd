import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Tool } from '../../Libs/Tool'

export default class CommentRow extends Component {
  render() {
    const { comment, settingStatus } = this.props;
    return (
      <div className={'comment-row' + (settingStatus ? ' hover' : '')}>
        <div className='comment-author'>
          { comment.icon ? <img src={comment.icon} /> : <div className='default-img'><i className='iconfont icon-people'></i></div> }
          <p className='author-name'>{ comment.author }</p>
        </div>
        <p className='comment-content' title={comment.content}>{ comment.content }</p>
        <div className='comment-statistics'>
          <div className='item'><i className='iconfont icon-appreciate'></i><span>{ Tool.numberFormat(comment.zan_count) }</span></div>
          <div className='item'><i className='iconfont icon-appreciate rotate-180'></i><span>{ Tool.numberFormat(comment.cai_count) }</span></div>
          <div className='item'><i className='iconfont icon-location'></i><span>{ comment.author_ip }</span></div>
        </div>
        <div className='action-delete' onClick={() => this.props.onDelete(comment._id)}><i className='iconfont icon-delete'></i></div>
      </div>
    );
  }
}

CommentRow.propTypes = {
  comment: PropTypes.object.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired
};
