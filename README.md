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
  ]
}

```

然后运行命令 `vue-component-builder`


## 注意

使用的项目需要安装下面的 npm 模块：

* `vue-runtime-helpers@1`
* `@babel/runtime@7`
* `core-js@2`
