import React, { Component, PropTypes } from 'react'
import ReactDOM, {render} from 'react-dom'
import {Provider} from 'react-redux'
import route from './Router/Route' //路由配置
import store from './Redux/Store/Store'
import './Libs/Config'//引入默认配置
// 引入样式
import './Styles/index.scss'

let unsubscribe = store.subscribe(() => { //监听state变化
    console.log(store.getState())
});

render(
    <Provider store={store}>
        {route}
    </Provider>,
    document.getElementById('app-root')
);
