// @ts-check
const clog = require('mora-scripts/libs/sys/clog')
const path = require('path')
const rollup = require('rollup')
const async = require('async')
const createConfig = require('./rollup.config')

module.exports = function (rootDir, configFile, cb) {
  const config = require(configFile)
  const out = config.outDir || 'dist'
  const outDir = path.resolve(rootDir, out)

  const rollupConfigs = config.components.map(c => createConfig(path.resolve(rootDir, c.entry), c.name, outDir, config))

  async.eachLimit(rollupConfigs, 4, async (rollupConfig) => {
    rollupConfig.input = path.resolve(rootDir, rollupConfig.input)

    const bundle = await rollup.rollup(rollupConfig)
    await bundle.write(rollupConfig.output)
    const component = config.components[rollupConfigs.indexOf(rollupConfig)]

    clog(`%ccreated %c${path.posix.join(out, component.name)}/index.js`, 'green', 'bold')

  }, cb)
}
