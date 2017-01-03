import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Tool } from '../../Libs/Tool'

export default class UserRow extends Component {
  render() {
    const { user, settingStatus } = this.props;
    return (
      <div className={'user-row' + (settingStatus ? ' hover' : '')}>
        <div className='user-img'>
          {
            user.icon ? <img src={user.icon} />
            : <i className='default-img iconfont icon-people'></i>
          }
          { user.active ? null : <i className='iconfont icon-lock'></i> }
        </div>
        <h4 className={'user-name ' + (user.sex)}>{ user.name }</h4>
        <p className='user-info'>邮箱: { user.email }</p>
        <p className='user-info'>手机: { user.tel }</p>
        <div className='user-permission'>{this.props.groupList.map((group, index) => { return group.type === user.groupId ? <i className='iconfont icon-vip'></i> : null})}</div>
        <div className='user-actions'>
          <div className='action' onClick={() => this.props.propChange(user._id, '/user/reset')}><i className='iconfont icon-order'></i></div>
          <div className='action' onClick={() => this.props.propChange(user._id, (user.active? '/user/lock' : '/user/unlock'))}>{user.active ? <i className='iconfont icon-lock'></i> : <i className='iconfont icon-unlock'></i>}</div>
        </div>
      </div>
    );
  }
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  propChange: PropTypes.func.isRequired,
  groupList: PropTypes.array.isRequired
};
