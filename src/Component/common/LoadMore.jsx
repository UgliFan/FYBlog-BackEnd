import React, { Component, PropTypes } from 'react'

export default class LoadMore extends Component {
  render() {
    return (
      <div className={`load-more`}>
        {this.props.fetchStatus === 1
        ? <div className='text-banner'>加载中</div>
        : (<div className='text-banner'>
            {this.props.pageNum > 1 ? <a className='pre-page' href='javascript:;' onClick={() => this.props.callPre()}>上一页</a> : null}
            <span>当前第{this.props.pageNum}页</span>
            {this.props.fetchStatus !== 2 ? <a className='next-page' href='javascript:;' onClick={() => this.props.callNext()}>下一页</a> : null}
          </div>)
        }
      </div>
    );
  }
}

LoadMore.propTypes = {
  fetchStatus: PropTypes.number.isRequired,
  pageNum: PropTypes.number.isRequired,
  callPre: PropTypes.func,
  callNext: PropTypes.func
};
