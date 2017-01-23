import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tool } from '../Libs/Tool'
import loadImage from '../Libs/image-to-canvas'

import {
  setFilters,
  setToolBar,
  showMessage,
  setConfirmDialog,
  closeConfirmDialog
} from '../Redux/Action/Index'
import { fetchGets } from '../Redux/Action/Data'

class FileEdit extends Component {
  constructor() {
    super();
    this.state = {
      toolBar: [{
        type: 'link',
        name: '取消',
        icon: 'iconfont icon-close',
        callBack: '/files'
      },{
        type: 'action',
        name: '保存',
        icon: 'iconfont icon-check',
        callBack: () => {
          this.props.dispatch(setConfirmDialog({
            title: '确认要保存嘛？',
            confirmCallback: () => {
              this.props.dispatch(closeConfirmDialog());
              this.dataPost();
            }
          }));
        }
      }],
      postData: {
        position: '',
        type: 'p'
      },
      selected: {
        _id: '',
        position: ''
      },
      folder: [],
      folderStatus: false,
      folderIndex: 0,
      hasImg: false,
      imgFile: null
    };
  }
  dataPost() {
    let postData = this.state.postData;
    postData.pid = this.state.selected._id;
    postData.file = this.state.imgFile;
    let post = new FormData(document.getElementById('formData'));
    Tool.upload('/file/save', post).then(data => {
      this.props.dispatch(showMessage({
        type: data.code === 0 ? 'success' : 'warn',
        text: data.msg
      }));
      if (data.code === 0) {
        this.props.router.push('/files');
      }
    }).catch(() => {
      this.props.dispatch(showMessage({
        type: 'danger',
        text: '网络错误，请稍后重试'
      }));
    });
  }
  getFolder() {
    this.props.dispatch(fetchGets('/file/page', {pid: '58845a31c52046b8ee7da9cb'}, (list) => {
      list = Object.prototype.toString.call(list) === '[object Array]' ? list : (list._id ? [list]: []);
      this.setState({
        folder: list,
        selected: list[this.state.folderIndex]
      });
    }, 'FileBread'));
  }
  dataChange(event, key) {
    let data = this.state.postData;
    data[key] = event.target.value;
    this.setState({
      postData: data
    });
  }
  componentWillMount() {
    this.props.dispatch(setFilters([]));
    this.props.dispatch(setToolBar(this.state.toolBar));
    this.getFolder();
    document.body.scrollTop = 0;
  }
  imgChange(e) {
    e.preventDefault();
    e.stopPropagation();
    let container = document.getElementById('img-container'),
      target = e.dataTransfer || e.target;
    let file = target && target.files && target.files[0];
    if(file){
      loadImage(file, img => {
        if (img.src || img instanceof HTMLCanvasElement) {
          this.setState({
            hasImg: true
          });
          container.appendChild(img);
          this.setState({
            imgFile: img.getContext('2d').getImageData(0, 0, 200, 200)
          });
        }
      }, {
        maxWidth: 200,
        maxHeight: 200,
        canvas: true,
        pixelRatio: window.devicePixelRatio,
        downsamplingRatio: 0.5,
        orientation: true
      });
    }
  }
  render() {
    return (
      <div className={this.props.sideBarStatus ? 'file-edit-container wide' : 'file-edit-container'}>
        <form name="formData" id="formData">
          <div className='input-block'>
            <label htmlFor="name">文件名</label>
            <input type="text" placeholder="输入文件名" name="name" id="name"/>
          </div>
          <div className='input-block'>
            <label>文件夹</label>
            <div className={'select-block' + (this.state.folderStatus ? ' active' : '')}>
              <input type="hidden" id="position" name="position" value={this.state.selected.position}/>
              <input type="hidden" id="pid" name="pid" value={this.state.selected._id}/>
              {this.state.folder.map((item, index) => {
                return <div onClick={() => this.setState({folderIndex: index, folderStatus: false, selected: item})} className={'select-item' + (this.state.folderIndex === index ? ' selected' : '')} key={index}>{item.name}</div>;
              })}
              <i className="iconfont icon-unfold" onClick={() => this.setState({folderStatus: !this.state.folderStatus})}></i>
            </div>
          </div>
          <div className="img-area">
            <h4 className="img-title">选择文件</h4>
            <label id="img-container" className="img-select" htmlFor="file">
              <input type="file" className="hidden" id="file" name="file" accept="image/*" onChange={(event) => this.imgChange(event)}/>
              <i className={'iconfont icon-add' + (this.state.hasImg ? ' hidden': '')}></i>
            </label>
          </div>
        </form>
      </div>
    );
  }
}

FileEdit.propTypes = {
  sideBarStatus: PropTypes.bool.isRequired
};

function select(state) {
  return {
    sideBarStatus: state.sideBarToggle
  };
}

export default connect(select)(FileEdit);
