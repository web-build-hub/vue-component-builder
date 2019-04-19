module.exports = {
  outDir: 'out',
  external: (id, parentId, isResolved) => {
    return false
  },
  components: [
    { name: 'marquee', entry: 'src/marquee/index.js' },
  ]
}
