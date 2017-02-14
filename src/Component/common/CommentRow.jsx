import React, { Component, PropTypes } from 'react'
import { Tool } from '../../Libs/Tool'

export default class CommentRow extends Component {
  render() {
    const { comment } = this.props;
    return (
      <div className='comment-row'>
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
  onDelete: PropTypes.func.isRequired
};
