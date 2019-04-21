const clog = require('mora-scripts/libs/sys/clog')
const path = require('path')
const fs = require('fs-extra')
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

    if (config.requireCss !== false) {
      const {output} = await bundle.generate(rollupConfig.output)
      const styleAsset = output.find(o => o.fileName.endsWith('.css'))
      const outputDir = rollupConfig.output.file ? path.dirname(rollupConfig.output.file) : outDir

      for (const chunkOrAsset of output) {

        const chunkFile = path.join(outputDir, chunkOrAsset.fileName)
        if (styleAsset && !chunkOrAsset.isAsset) {
          const styleFile = path.join(outputDir, styleAsset.fileName)
          const relative = path.relative(path.dirname(chunkFile), styleFile).replace(/\\/g, '/')
          chunkOrAsset.code = chunkOrAsset.code.replace(/^(['"]use strict['"];)?/, `$1\nrequire('./${relative}');`)
        }

        fs.ensureDirSync(path.dirname(chunkFile))
        fs.writeFileSync(chunkFile, chunkOrAsset.code || chunkOrAsset.source)
      }

    } else {
      await bundle.write(rollupConfig.output)
    }

    const component = config.components[rollupConfigs.indexOf(rollupConfig)]

    clog(`%ccreated %c${path.posix.join(out, component.name)}/index.js`, 'green', 'bold')

  }, cb)
}
