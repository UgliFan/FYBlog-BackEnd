import { Promise } from 'es6-promise'
import { Target } from './Config';
const Tool = {};

Tool.post = (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: url,
      contentType:'application/json',
      data: JSON.stringify(data),
      success: data => resolve(data),
      error: err => reject(err)
    });
  });
};

Tool.get = (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: url,
      data: data,
      success: data => resolve(data),
      error: err => reject(err)
    });
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

Tool.paramsFormat = data => {
  let paramArr = [];
  for (let attr in data) {
    paramArr.push(`${attr}=${data[attr]}`);
  }
  return `?${paramArr.join('&')}`;
};

Tool.numberFormat = num => {
  if (num === undefined || (typeof num !== 'number') || num === 0) {
    return '-';
  }
  if (Math.abs(num) <= 10000) {
    return num;
  } else if (Math.abs(num) <= 100000000) {
    return Math.round(num/1000) / 10 + '万';
  } else {
    return Math.round(num/10000000) / 10 + '亿';
  }
};

export { Tool, Target }
