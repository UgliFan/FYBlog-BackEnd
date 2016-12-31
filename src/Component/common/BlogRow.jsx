import React, { Component, PropTypes } from 'react'
import { Tool } from '../../Libs/Tool'

export default class BlogRow extends Component {
  render() {
    const { blog } = this.props;
    return (
      <div className='blog-row'>
        <div className='blog-img'>
          { blog.isOff ? <i className='iconfont icon-lock'></i> : null }
          {
            blog.icon ? <img src={blog.icon} />
            : <i className='default-img iconfont icon-text'></i>
          }
        </div>
        <h4 className='blog-title'>{ blog.title }</h4>
        <p className='blog-remark'>{ blog.remark }</p>
        <div className='blog-statistics'>
          <div className='item'><i className='iconfont icon-profile'></i><span>{ blog.author }</span></div>
          <div className='item'><i className='iconfont icon-location'></i><span>{ Tool.numberFormat(blog.visit_count) }</span></div>
          <div className='item'><i className='iconfont icon-appreciate'></i><span>{ Tool.numberFormat(blog.zan_count) }</span></div>
          <div className='item'><i className='iconfont icon-comment'></i><span>{ Tool.numberFormat(blog.reply_count) }</span></div>
        </div>
        <div className='blog-actions'>
          <div className='action'>编辑</div>
          <div className='action'>置顶</div>
          <div className='action'>{ blog.isOff ? '解禁' : '下架'}</div>
          <div className='action'>删除</div>
        </div>
      </div>
    );
  }
}

BlogRow.propTypes = {
  blog: PropTypes.object.isRequired
};
