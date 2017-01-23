import React, { Component, PropTypes } from 'react'

export default class FileRow extends Component {
  constructor() {
    super();
    this.state = {
      fileType: {
        'f': 'icon-file',
        'p': 'icon-pic',
        'o': 'icon-question'
      }
    };
  }
  nameClick(file) {
    if (file.type === 'f') {
      this.props.changeDepth(file.position, file._id);
    }
  }
  render() {
    const { file, settingStatus, download, deleteFile } = this.props;
    return (
      <div className={'file-row' + (settingStatus ? ' hover' : '')}>
        <div className={'file-name' + (file.type === 'f' ? ' folder' : '')} onClick={() => this.nameClick(file)}>
          {file.type === 'f' ? <span>{file.name}</span>
            : (<div className="nick-name"><p className="nick">{file.nick_name}</p><p className="name">{file.name}</p></div>)}
        </div>
        <div className="file-type"><i className={'iconfont ' + this.state.fileType[file.type]}></i></div>
        {file.type !== 'f' ? <div className="file-download" onClick={() => download(file._id)}><i className="iconfont icon-down"></i></div> : null}
        <div className="file-delete" onClick={() => deleteFile(file._id)}><i className="iconfont icon-delete"></i></div>
      </div>
    );
  }
}

FileRow.propTypes = {
  file: PropTypes.object.isRequired,
  settingStatus: PropTypes.bool.isRequired,
  changeDepth: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired
};
