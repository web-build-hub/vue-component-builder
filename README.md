# vue-component-builder


## 使用

在项目根目录添加配置文件 `vue-component.config.js`

```js

module.exports = {
  outDir: 'dist',
  external: (id, parentId, isResolved) => {
    return false
  },
  components: [
    { name: 'swipe', entry: 'path/to/swipe.js' },
    { name: 'tab', entry: 'path/to/tab.js' },
    // ...
  ],
  // 是否在 js 中 require 对应的 css 文件
  requireCss: true,
  // postcss-px-to-viewport 插件配置
  px2viewport: {},
  // 图片 inline
  urlLimit: 1024,
  // rollup 的 output 配置（可选）
  output: {},
  // 生成动态 rollup 配置（可选）
  rollup(entry, name, outDir, opts) {
    return {...}
  }
}

```

然后运行命令 `vue-component-builder`


## 注意

使用的项目需要安装下面的 npm 模块：

* `vue-runtime-helpers@1`
* `@babel/runtime@7`
* `core-js@2`
