#!/usr/bin/env node

const cli = require('mora-scripts/libs/tty/cli')
const findup = require('mora-scripts/libs/fs/findup')
const path = require('path')
const builder = require('./builder')

cli({
  desc: 'vue component builder',
  version: () => require('../package.json').version
})
.options({
  'r | rootDir': '<string> 指定根目录，默认配置文件所在的目录',
  'c | configFile': '<string> 指定配置文件路径',
})
.parse(function (res) {
  let {configFile, rootDir} = res
  if (configFile) configFile = path.resolve(configFile)
  if (rootDir) rootDir = path.resolve(rootDir)

  if (configFile && !rootDir) {
    rootDir = path.dirname(configFile)
  } else if (!rootDir) {
    rootDir = process.cwd()
  }

  if (!configFile) configFile = findup.file(rootDir, 'vue-component.config.js')

  builder(rootDir, configFile, (err) => {
    if (err) this.error(err)
  })
})
