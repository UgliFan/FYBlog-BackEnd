import FastClick from './FastClick.js'

((doc, win) => {
  const docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = () => {
      let clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = `${ 20 * clientWidth / 320 }px`;
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  //当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
})(document, window);

// 装载FastClick
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
  }, false);
}

const System = (() => {
  let u = navigator.userAgent;
  let system = (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1)
    ? 'Android' : (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    ? 'IOS' : '');
  return system;
})();

const Target = process.env.NODE_ENV !== 'production' ? '' : '//back.fyq2yj.cn'; //目标网站

export { Target, System }
