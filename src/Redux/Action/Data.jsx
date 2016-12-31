import fetch from 'isomorphic-fetch'
import { Target, Tool } from '../../Libs/Tool'

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const ERROR_POSTS = 'ERROR_POSTS';

export const GET_DATA_START = 'GET_DATA_START';
export const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS';
export const GET_DATA_FAIL = 'GET_DATA_FAIL';

const requestPosts = path => {
  return {
    type: REQUEST_POSTS,
    path
  }
}
const receivePosts = (path, json) => {
  console.log(json);
  return {
    type: RECEIVE_POSTS,
    path,
    json: json.data.children.map(child => child.data)
  }
}

const errorPosts = path => {
  return {
    type: ERROR_POSTS,
    path
  };
};

export function fetchPosts(path, postData) {
  let url = Target + path + Tool.paramsFormat(postData);
  return dispatch => {
    dispatch(requestPosts(path));
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(path, json)))
      .catch(error => dispatch(errorPosts(path)));
  }
}

const getDataStart = (path, name) => {
  return {
    type: GET_DATA_START,
    path, name
  };
}

const getDataSuccess = (path, list, success, name) => {
  return {
    type: GET_DATA_SUCCESS,
    path, list, success, name
  };
};

const getDataFail = (path, name) => {
  return {
    type: GET_DATA_FAIL,
    path, name
  };
};

export function fetchGets(path, postData, success, name) {
  let url = path + Tool.paramsFormat(postData);
  return dispatch => {
    dispatch(getDataStart(path, name));
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'
    }).then(response => response.json())
    .then(json => {
      if (json.code === 0) {
        dispatch(getDataSuccess(path, json.result, success, name));
      } else {
        dispatch(getDataFail(path, name));
      }
    })
    .catch(error => dispatch(getDataFail(path, name)));
  };
}
