const vue = require('rollup-plugin-vue')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const autoprefixer = require('autoprefixer')
const path = require('path')

const EXTERNAL = /^(vue|core-js|@babel\/runtime|vue-runtime-helpers|regenerator-runtime)(\/|$)/

module.exports = function createConfig(
  entry,
  name,
  outDir,
  opts
) {
  return   {
    input: entry,
    external: function(id) {
      return EXTERNAL.test(id) || /node_modules/.test(id) || (opts.external && opts.external.apply(null, arguments))
    },
    output: {
      format: 'commonjs',
      file: path.join(outDir, name, 'index.js'),
      ...opts.output
    },
    plugins: [
      // 解析 .vue 文件
      vue({ css: false }),

      babel({
        runtimeHelpers: true,
        babelrc: false,
        plugins: [
          [require.resolve('@babel/plugin-transform-runtime'), {useESModules: true}],
          require.resolve('@babel/plugin-proposal-class-properties'),
          require.resolve('@babel/plugin-syntax-dynamic-import'),
        ],
        presets: [
          [require.resolve('@babel/preset-env'), { modules: false, useBuiltIns: 'usage', corejs: 2 }]
        ]
      }),
      // 解析 node_modules 中的模块
      resolve(),
      // 将 module.exports 编译成 export default
      commonjs(),

      postcss({
        extract: path.join(outDir, name, 'index.css'),
        extensions: ['scss', 'css'],
        plugins: [
          // autoprefixer({browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']})
          autoprefixer()
        ]
      }),
    ]
  }
}
