export const SIDE_BAR_TOGGLE = 'SIDE_BAR_TOGGLE';
export const MENU_CHANGE = 'MENU_CHANGE';
export const SET_FILTERS = 'SET_FILTERS';
export const SELECT_FILTER = 'SELECT_FILTER';
export const SET_TOOLBAR = 'SET_TOOLBAR';
export const SETTING_TOGGLE = 'SETTING_TOGGLE';
export const INDEX_SCROLL_POS = 'INDEX_SCROLL_POS';

export const MenuList = [{
  key: 1,
  name: '博文',
  link: '/blogs',
  className: 'iconfont icon-news',
  classNameActive: 'iconfont icon-newsfill',
  active: true
}, {
  key: 2,
  name: '标签',
  link: '/tags',
  className: 'iconfont icon-tag',
  classNameActive: 'iconfont icon-tagfill'
}, {
  key: 3,
  name: '评论',
  link: '/comments',
  className: 'iconfont icon-comment',
  classNameActive: 'iconfont icon-commentfill'
}, {
  key: 4,
  name: '用户',
  link: '/users',
  className: 'iconfont icon-people',
  classNameActive: 'iconfont icon-peoplefill'
}];

export function changeMenu(index) {
  return { type: MENU_CHANGE, index };
}

export function toggleSideBar() {
  return { type: SIDE_BAR_TOGGLE }
}

export function setFilters(filters) {
  return { type: SET_FILTERS, filters };
}

export function selectFilter(index) {
  return { type: SELECT_FILTER, index };
}

export function setToolBar(toolBar) {
  return { type: SET_TOOLBAR, toolBar };
}

export function toggleSetting() {
  return { type: SETTING_TOGGLE };
}

export function setIndexScrollPos(pos) {
  return { type: INDEX_SCROLL_POS, pos };
}
