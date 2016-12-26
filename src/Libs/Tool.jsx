import { Promise } from 'es6-promise'
import { Target } from './Config';
const Tool = {};

// 特殊字符转义
var filter = (str) => {
  str += '';
  str = str.replace(/%/g, '%25');
  str = str.replace(/\+/g, '%2B');
  str = str.replace(/ /g, '%20');
  str = str.replace(/\//g, '%2F');
  str = str.replace(/\?/g, '%3F');
  str = str.replace(/&/g, '%26');
  str = str.replace(/\=/g, '%3D');
  str = str.replace(/#/g, '%23');
  return str;
};

var httpEnd = (xhr, params) => {
  if (xhr.readyState === 4) {
    let head = xhr.getAllResponseHeaders();
    let response = xhr.responseText;
    // 转化成json
    if (/application\/json/.test(head) || params.dataType === 'json' && /^(\{|\[)([\s\S])*?(\]|\})$/.test(response)) {
      response = JSON.parse(response);
    }
    if (xhr.status == 200) {
      params.success(response, params, xhr);
    } else {
      params.error(params, xhr);
    }
  }
};

/**
 * 发送ajax请求和服务器交互
 * @param {object} setting 配置ajax的配置
 */
Tool.ajax = (setting) => {
  let params = {
    url: window.location.pathname,
    async: true,
    type: 'GET',
    data: {},
    dataType: 'json',
    success: function() {},
    error: function() {}
  };
  let aData = [], sData = '';
  for (let attr in setting) {
    params[attr] = setting[attr];
  }
  for (let attr in params.data) {
    aData.push(`${attr}=${filter(params.data[attr])}`);
  }
  sData = aData.join('&');
  params.type = params.type.toUpperCase();

  let xhr = new XMLHttpRequest();
  try {
    if (params.type === 'POST') {
      xhr.open(params.type, params.url, params.async);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(sData);
    } else {
      sData = `${params.url}?${sData}`;
      xhr.open(params.type, `${sData}&${new Date().getTime()}`, params.async);
    }
  } catch (e) {
    return httpEnd(xhr, params);
  }

  if (params.async) {
    xhr.addEventListener('readystatechange', httpEnd, false);
  } else {
    httpEnd();
  }

  xhr.end = () => {
    xhr.removeEventListener('readystatechange', httpEnd, false);
  };

  return xhr;
};

Tool.post = (url, data) => {
  return new Promise((resolve, reject) => {
    var setting = {
      url: url,
      type: 'POST',
      data: data,
      success: resolve,
      error: reject
    };
    Tool.ajax(setting);
  });
};

Tool.get = (url, data) => {
  return new Promise((resolve, reject) => {
    var setting = {
      url: url,
      type: 'GET',
      data: data,
      success: resolve,
      error: reject
    };
    Tool.ajax(setting);
  });
};

Tool.formateDate = (str) => {
  var date = new Date(str);
  var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
      return '';
  } else if (time / 1000 < 60) {
      return '刚刚';
  } else if ((time / 60000) < 60) {
      return parseInt((time / 60000)) + '分钟前';
  } else if ((time / 3600000) < 24) {
      return parseInt(time / 3600000) + '小时前';
  } else if ((time / 86400000) < 31) {
      return parseInt(time / 86400000) + '天前';
  } else if ((time / 2592000000) < 12) {
      return parseInt(time / 2592000000) + '月前';
  } else {
      return parseInt(time / 31536000000) + '年前';
  }
};

Tool.localItem = (key, value) => {
  if (arguments.length == 1) {
    return localStorage.getItem(key);
  } else {
    return localStorage.setItem(key, value);
  }
};

Tool.removeLocalItem = (key) => {
  if (key) {
    return localStorage.removeItem(key);
  }
  return localStorage.removeItem();
};

export { Tool, Target }