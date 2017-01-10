import React, { Component, PropTypes } from 'react'

export default class Message extends Component {
  constructor() {
    super();
    this.state = {
      iconClass: {
        danger: 'iconfont icon-roundclose',
        warn: 'iconfont icon-warn',
        info: 'iconfont icon-info',
        success: 'iconfont icon-roundcheck'
      },
      show: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.info.text !== '' && nextProps.info.text !== this.props.info.text) {
      this.setState({
        show: true
      });
      setTimeout(() => {
        this.setState({
          show: false
        });
        setTimeout(() => {
          this.props.msgHide && this.props.msgHide();
        }, 300);
      }, this.props.info.timeStamp || 2000);
    }
  }
  render() {
    return (
      <div className={`global-message${this.state.show ? ' msg-show' : ''} ${this.props.info.type}`}>
        <i className={this.state.iconClass[this.props.info.type]}></i>
        <span className='msg-text'>{this.props.info.text}</span>
      </div>
    );
  }
}

Message.propTypes = {
  info: PropTypes.shape({
    type: PropTypes.oneOf([
      'danger',
      'warn',
      'info',
      'success'
    ]).isRequired,
    text: PropTypes.string.isRequired,
    timeStamp: PropTypes.number
  }).isRequired,
  msgHide: PropTypes.func
};
