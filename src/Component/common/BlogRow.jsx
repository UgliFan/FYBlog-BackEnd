import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Tool } from '../../Libs/Tool'

export default class BlogRow extends Component {
  render() {
    const { blog, settingStatus } = this.props;
    return (
      <div className={'blog-row' + (settingStatus ? ' hover' : '')}>
        <div className='blog-img'>
          {
            blog.icon ? <img src={blog.icon} />
            : <i className='default-img iconfont icon-text'></i>
          }
          { blog.isOff ? <i className='iconfont icon-lock'></i> : null }
          { blog.top ? <i className='iconfont icon-top'></i> : null }
        </div>
        <h4 className='blog-title'>{ blog.title }</h4>
        <p className='blog-remark'>{ blog.remark }</p>
        <div className='blog-statistics'>
          <div className='item'><i className='iconfont icon-profile'></i><span>{ blog.author }</span></div>
          <div className='item'><i className='iconfont icon-location'></i><span>{ Tool.numberFormat(blog.visit_count) }</span></div>
          <div className='item'><i className='iconfont icon-appreciate'></i><span>{ Tool.numberFormat(blog.zan_count) }</span></div>
          <Link to={`/comments/${blog._id}`}><div className='item'><i className='iconfont icon-comment'></i><span>{ Tool.numberFormat(blog.reply_count) }</span></div></Link>
        </div>
        <div className='blog-actions'>
          <Link to={`/blogs/edit/${blog._id}`}><div className='action'><i className='iconfont icon-write'></i></div></Link>
          <div className='action' onClick={() => this.props.propChange(blog._id, ('/blog/' + (blog.top ? 'down' : 'up')))}>{ blog.top ? <i className='iconfont icon-down'></i> : <i className='iconfont icon-top'></i> }</div>
          <div className='action' onClick={() => this.props.propChange(blog._id, ('/blog/' + (blog.isOff ? 'on' : 'off')))}>{ blog.isOff ? <i className='iconfont icon-unlock'></i> : <i className='iconfont icon-lock'></i>}</div>
          <div className='action' onClick={() => this.props.onDelete(blog._id)}><i className='iconfont icon-delete'></i></div>
        </div>
      </div>
    );
  }
}

BlogRow.propTypes = {
  blog: PropTypes.object.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  propChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
