webpackJsonp([1],{

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _pureRenderDecorator = __webpack_require__(277);

	var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

	var _reactRouter = __webpack_require__(220);

	var _reactRedux = __webpack_require__(171);

	var _immutable = __webpack_require__(281);

	var _Tool = __webpack_require__(285);

	var _Index = __webpack_require__(287);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	//@pureRender
	var Tags = function (_Component) {
	  _inherits(Tags, _Component);

	  function Tags() {
	    _classCallCheck(this, Tags);

	    var _this = _possibleConstructorReturn(this, (Tags.__proto__ || Object.getPrototypeOf(Tags)).call(this));

	    _this.state = {
	      filters: [{ name: '全部' }, { name: '系统', on: true }, { name: '自定义' }]
	    };
	    return _this;
	  }

	  _createClass(Tags, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.props.dispatch((0, _Index.setFilters)(this.state.filters));
	      this.props.dispatch((0, _Index.setToolBar)([]));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement('div', null);
	    }
	  }]);

	  return Tags;
	}(_react.Component);

	Tags.propTypes = {};

	function select(state) {
	  return {};
	}

	exports.default = (0, _reactRedux.connect)(select)(Tags);

/***/ }

});