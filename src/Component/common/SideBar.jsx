import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class SideBar extends Component {
  render() {
    return (
      <nav className={this.props.status ? 'collapsed' : ''}>
        <ul>
          {this.props.menuList.map((menu, index) => {
            return (<Link key={index} to={menu.link}><li key={index}
              className={menu.active ? 'active' : ''}
              onClick={() => this.props.onChange()}>
              <i className={menu.active ? menu.classNameActive : menu.className}></i>
              {menu.name}
            </li></Link>);
          })}
          <a href='/login'><li><i className='iconfont icon-exit'></i>退出登录</li></a>
        </ul>
      </nav>
    );
  }
}

SideBar.propTypes = {
  status: PropTypes.bool.isRequired,
  menuList: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
