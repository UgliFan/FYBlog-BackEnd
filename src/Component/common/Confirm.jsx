import React, { Component, PropTypes } from 'react'

export default class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }
  componentDidMount() {
    if (this.props.config.title !== '') {
      setTimeout(() => {
        this.setState({
          show: true
        });
      }, 100);
    }
  }
  handleCancel() {
    this.setState({
      show: false
    });
    setTimeout(() => {
      this.props.onCancel && this.props.onCancel();
    }, 100);
  }
  handleConfirm() {
    this.setState({
      show: false
    });
    setTimeout(() => {
      this.props.config.confirmCallback && this.props.config.confirmCallback();
    }, 100);
  }
  render() {
    return (
      <div className={`global-confirm${this.state.show ? ' confirm-show' : ''}`}>
        <div className='confirm-body'>
          <div className='confirm-title'>防止手贱</div>
          <p className='confirm-text'><i className='iconfont icon-question'></i>{this.props.config.title}</p>
          <div className='action-btns'>
            <a href='javascript:;' onClick={() => this.handleCancel()}>取消</a>
            <a href='javascript:;' onClick={() => this.handleConfirm()}>确定</a>
          </div>
        </div>
      </div>
    );
  }
}

Confirm.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    confirmCallback: PropTypes.func
  }).isRequired,
  onCancel: PropTypes.func
};
