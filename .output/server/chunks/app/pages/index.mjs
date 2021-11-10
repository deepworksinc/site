function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    } }
  }
  return Object.freeze(n);
}

var pages = {};

var ids = pages.ids = [1];
var modules = pages.modules = {

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(8).default;
module.exports.__inject__ = function (context) {
  add("6ed08cc6", content, true, context);
};

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ __webpack_require__(0);
/* harmony import */ var _node_modules_unplugin_dist_webpack_loaders_transform_js_ref_34_0_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_nuxt_postcss8_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_nuxt_postcss8_node_modules_postcss_loader_dist_cjs_js_ref_5_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_unplugin_dist_webpack_loaders_transform_js_ref_32_0_node_modules_unplugin_dist_webpack_loaders_transform_js_ref_33_0_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_unplugin_dist_webpack_loaders_transform_js_ref_34_0_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_nuxt_postcss8_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_nuxt_postcss8_node_modules_postcss_loader_dist_cjs_js_ref_5_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_unplugin_dist_webpack_loaders_transform_js_ref_32_0_node_modules_unplugin_dist_webpack_loaders_transform_js_ref_33_0_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_unplugin_dist_webpack_loaders_transform_js_ref_34_0_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_nuxt_postcss8_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_nuxt_postcss8_node_modules_postcss_loader_dist_cjs_js_ref_5_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_node_modules_unplugin_dist_webpack_loaders_transform_js_ref_32_0_node_modules_unplugin_dist_webpack_loaders_transform_js_ref_33_0_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__[key]; }); }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "body,html{margin:0;overflow:hidden}body,html,video{width:100vw;height:100vh}video{-o-object-fit:cover;object-fit:cover;position:fixed;top:0;left:0}.viewport-header{position:relative;height:100vh;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;background-color:rgba(0,0,0,.25);padding:0 22.5px}.viewport-header>img{margin:0;filter:invert(1);max-width:650px;width:100%}.viewport-header>img+p{font-size:22.5px;color:#fff;font-family:\"Open Sans\",sans-serif;max-width:650px;width:100%}@media screen and (max-width:414px){.viewport-header>img{font-size:50px}.viewport-header>img+p{font-size:15px}}", ""]);
// Exports
___CSS_LOADER_EXPORT___.locals = {};
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/composition-api/dist/vue-composition-api.mjs
__webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/unplugin/dist/webpack/loaders/transform.js??ref--34-0!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/unplugin/dist/webpack/loaders/transform.js??ref--32-0!./node_modules/unplugin/dist/webpack/loaders/transform.js??ref--33-0!./pages/index.vue?vue&type=template&id=6af459cd&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container"},[_vm._ssrNode("<video id=\"bgvid\" playsinline autoplay=\"autoplay\" muted=\"muted\" loop=\"loop\" poster=\"seabg.jpg\"><source src=\"seabg.mp4\" type=\"video/mp4\"></video> <header class=\"viewport-header\"><img src=\"deepworks-logo.png\"> <p>Building tools for you to go deeper on fitness and focus.</p></header>")])};
var staticRenderFns = [];


// CONCATENATED MODULE: ./pages/index.vue?vue&type=template&id=6af459cd&

// EXTERNAL MODULE: ./node_modules/@nuxt/bridge/dist/runtime/vue2-bridge.mjs + 1 modules
var vue2_bridge = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/unplugin/dist/webpack/loaders/transform.js??ref--34-0!./node_modules/babel-loader/lib??ref--0-0!./node_modules/@nuxt/components/dist/loader.js??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/unplugin/dist/webpack/loaders/transform.js??ref--32-0!./node_modules/unplugin/dist/webpack/loaders/transform.js??ref--33-0!./pages/index.vue?vue&type=script&lang=ts&

/* harmony default export */ var transform_ref_33_0_pagesvue_type_script_lang_ts_ = (vue2_bridge["default"].extend({}));
// CONCATENATED MODULE: ./pages/index.vue?vue&type=script&lang=ts&
 /* harmony default export */ var pagesvue_type_script_lang_ts_ = (transform_ref_33_0_pagesvue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(54);
if (style0.__inject__) style0.__inject__(context);

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pagesvue_type_script_lang_ts_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "2968dbea"
  
);

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ })

};

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  'default': pages,
  ids: ids,
  modules: modules
}, [pages]));

export { index as i };
