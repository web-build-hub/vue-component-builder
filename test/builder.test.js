const builder = require('../src/builder')
const path = require('path')
const fs = require('fs')

const fixtures = path.resolve(__dirname, 'fixtures')

describe('test builder', () => {

  it('should build', (done) => {
    builder(fixtures, path.join(fixtures, 'vue-component.config.js'), (err) => {
      if (err) {
        return done(err)
      }

      const snapshotDir = path.join(fixtures, 'snapshot', 'marquee')
      const outDir = path.join(fixtures, 'out', 'marquee')

      const snapNames = fs.readdirSync(snapshotDir)
      const outNames = fs.readdirSync(outDir)
      expect(snapNames).toEqual(outNames)

      snapNames.forEach(name => {
        fs.readFileSync(path.join(snapshotDir, name)).equals(fs.readFileSync(path.join(outDir, name)))
      })

      done()
    })
  }, 50000)
})
