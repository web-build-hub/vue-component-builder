import Marquee from './index.vue'

import('core-js').then(d => {
  console.log(d)
})

Marquee.install = function(Vue) {
  Vue.component(Marquee.name, Marquee)
}

export default Marquee

export class Test {
  static a = []
  b = 1
  get test() {
    return this.b
  }
  set test(value) {
    this.b = value
  }
  async render() {
    return 'foo'
  }
}
