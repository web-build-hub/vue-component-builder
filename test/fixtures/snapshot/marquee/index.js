import _regeneratorRuntime from '@babel/runtime/regenerator';
import 'regenerator-runtime/runtime';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import 'core-js/modules/es6.function.name';
import 'core-js/modules/es6.array.is-array';
import 'core-js/modules/es6.number.constructor';
import 'core-js/modules/es6.array.index-of';
import __vue_normalize__ from 'vue-runtime-helpers/dist/normalize-component.js';

var script = {
  name: 'marquee',
  props: {
    /** 滚动的方向 */
    direction: {
      type: String,
      "default": 'up',
      validator: function validator(value) {
        return ['up', 'down', 'left', 'right'].indexOf(value) >= 0;
      }
    },

    /** 单个条目显示的时长 */
    duration: Number,

    /** 滚动的所有条目 */
    rows: {
      type: Array,
      required: true,
      validator: function validator(value) {
        return Array.isArray(value) && value.every(function (v) {
          return typeof v === 'string';
        });
      }
    }
  },
  data: function data() {
    return {
      trackStyle: {},
      rowStyle: {},
      lastRowStyle: {}
    };
  },
  computed: {
    coord: function coord() {
      return ['up', 'down'].indexOf(this.direction) >= 0 ? 'y' : 'x';
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.refresh();
    this.$watch('rows', function () {
      return _this.refresh();
    });
  },
  methods: {
    refresh: function refresh() {
      var rows = this.rows;
      var root = this.$refs.root;
      var width = root.clientWidth;
      var height = root.clientHeight;
      var duration = this.duration || (this.coord === 'x' ? 3500 : 1000);
      var trackStyle = {
        animationName: 'marquee-' + this.direction,
        animationDuration: duration * rows.length + 'ms'
      };
      var rowStyle = {
        width: width + 'px',
        height: height + 'px'
      };
      var lastRowStyle = {};

      if (this.coord === 'x') {
        trackStyle.width = rows.length * width + 'px';
        lastRowStyle.right = "-".concat(width, "px");
      } else {
        trackStyle.height = rows.length * height + 'px';
        lastRowStyle.bottom = "-".concat(height, "px");
      }

      this.trackStyle = trackStyle;
      this.rowStyle = rowStyle;
      this.lastRowStyle = lastRowStyle;
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { ref: "root", class: "marquee marquee--" + this.coord }, [
    _c(
      "div",
      { staticClass: "marquee-track", style: _vm.trackStyle },
      [
        _vm._l(_vm.rows, function(text, index) {
          return _c(
            "div",
            {
              key: index + text,
              staticClass: "marquee-row",
              style: _vm.rowStyle
            },
            [
              _vm._t("renderRow", [_vm._v(_vm._s(text))], {
                item: { text: text, index: index }
              })
            ],
            2
          )
        }),
        _vm._v(" "),
        _vm.rows.length
          ? _c(
              "div",
              {
                staticClass: "marquee-row",
                style: [_vm.rowStyle, _vm.lastRowStyle]
              },
              [
                _vm._t("renderRow", [_vm._v(_vm._s(_vm.rows[0]))], {
                  item: { text: _vm.rows[0], index: 0 }
                })
              ],
              2
            )
          : _vm._e()
      ],
      2
    ),
    _vm._v(" "),
    _c("div", { staticClass: "marquee-custom" }, [_vm._t("default")], 2)
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Marquee = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

import('core-js').then(function (d) {
  console.log(d);
});

Marquee.install = function (Vue) {
  Vue.component(Marquee.name, Marquee);
};
var Test =
/*#__PURE__*/
function () {
  function Test() {
    _classCallCheck(this, Test);

    _defineProperty(this, "b", 1);
  }

  _createClass(Test, [{
    key: "render",
    value: function () {
      var _render = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", 'foo');

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: "test",
    get: function get() {
      return this.b;
    },
    set: function set(value) {
      this.b = value;
    }
  }]);

  return Test;
}();

_defineProperty(Test, "a", []);

export default Marquee;
export { Test };
