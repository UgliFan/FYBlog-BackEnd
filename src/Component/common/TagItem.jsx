import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class TagItem extends Component {
  render() {
    const { tag, settingStatus, propChange, onDelete } = this.props;
    return (
      <div className={'tag-item' + (settingStatus ? ' hover' : '')}>
        <i className='iconfont icon-tag'></i>
        <h4>{tag.name}</h4>
        <span>{this.props.typeList.map((type, index) => {
          return type.key === tag.type ? type.name : null;
        })}</span>
        { tag.type !== 0 ? <Link to={`/tags/edit/${tag._id}`}><div className='tag-edit'><i className='iconfont icon-write'></i></div></Link> : null }
        { tag.type !== 0 ? <div className='tag-delete' onClick={() => onDelete(tag._id)}><i className='iconfont icon-delete'></i></div> : null }
      </div>
    );
  }
}

TagItem.propTypes = {
  tag: PropTypes.object.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  propChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  typeList: PropTypes.array.isRequired
};
