const clog = require('mora-scripts/libs/sys/clog')
const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const async = require('async')
const createConfig = require('./rollup.config')
const {parse, NODE_TYPE} = require('@mora/module-parse')

module.exports = function (rootDir, configFile, cb) {
  const config = require(configFile)
  const out = config.outDir || 'dist'
  const outDir = path.resolve(rootDir, out)
  const types = []

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

    const file = path.join(outDir, component.name, 'index.js')

    const type = {name: component.name, hasDefault: false, variables: []}
    types.push(type)
    makeTypes(file, type)
    clog(`%ccreated %c${path.posix.join(out, component.name)}/index.js, index.d.ts`, 'green', 'bold')
  }, (err) => {
    if (err) return cb(err)
    const res = makeEntry(types)
    fs.writeFileSync(path.join(outDir, 'index.js'), res.esnext)
    fs.writeFileSync(path.join(outDir, 'index.d.ts'), res.dts)
    cb()
  })
}

function makeEntry(types) {
  const content = []

  types.forEach(t => {
    const variables = []
    if (t.hasDefault) variables.push(`default as ${pascalCase(t.name)}`)
    t.variables.forEach(v => variables.push(v))
    if (variables.length) {
      content.push(`export { ${variables.join(', ')} } from './${t.name}/index'`)
    }
  })

  return {
    esnext: array2content(content),
    dts: array2content(content)
  }
}

function makeTypes(file, type) {
  const dtsFile = file.replace(/\.js/, '.d.ts')
  let dtsContent = []
  const {nodes, warnings} = parse(fs.readFileSync(file).toString(), {includes: ['exports']})
  if (warnings.length) warnings.forEach(w => clog('%c ⚠️' + w, 'yellow.high'))
  nodes.forEach(n => {
    if (n.type === NODE_TYPE.EXPORTS_DEFAULT) {
      dtsContent.push(`export default any;`)
      type.hasDefault = true
    } else if (n.type === NODE_TYPE.EXPORTS_VARIABLE) {
      type.variables.push(n.variable)
      dtsContent.push(`export declare const ${n.variable}: any;`)
    }
  })

  fs.writeFileSync(dtsFile, array2content(dtsContent) + '\n')
}

function array2content(arr) {
  return arr.map(a => a + '\n').join('')
}

function pascalCase(str) {
  str = str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+(\w?)/g, (r, k) => k.toUpperCase())
  return str[0].toUpperCase() + str.substr(1)
}
