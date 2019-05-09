const vue = require('rollup-plugin-vue')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const url = require('rollup-plugin-url')
const postcssUrl = require('postcss-url')
const autoprefixer = require('autoprefixer')
const path = require('path')
const fs = require('fs-extra')

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
      // dir: path.join(outDir, name),
      ...opts.output
    },
    plugins: [
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

      // 解析 .vue 文件
      vue({ css: false }),

      postcss({
        extract: path.join(outDir, name, 'index.css'),
        extensions: ['scss', 'css'],
        plugins: [
          // autoprefixer({browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']})
          autoprefixer(),
          postcssUrl({
            // basePath:
            url: 'copy',
            filter: '**/*.{gif,png,jpg,jpeg,svg}',
            basePath: path.dirname(entry),
            assetsPath: path.join(outDir, name),
            useHash: false,
            url(asset, dir) {
              if (fs.existsSync(asset.absolutePath) && asset.absolutePath.includes(path.dirname(entry))) {
                const out = path.join(outDir, name, ...asset.originUrl.split('/'))
                fs.ensureDirSync(path.dirname(out))
                fs.copyFileSync(asset.absolutePath, out)
              }
              return asset.originUrl
            }
          }),
        ]
      }),

      url({ limit: 1024, fileName: '[name][extname]' }),

    ],
    ...(opts.rollup ? opts.rollup(...arguments) : {})
  }
}
