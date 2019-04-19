<template>
  <div ref='root' :class='"marquee marquee--" + this.coord'>
    <div class='marquee-track' :style='trackStyle'>
      <div class='marquee-row' v-for='(text, index) in rows' :key='index + text' :style='rowStyle'>
        <slot name='renderRow' :item='{ text, index }'>{{text}}</slot>
      </div>
      <!-- 重复渲染第一行 -->
      <div class='marquee-row' v-if='rows.length' :style='[rowStyle, lastRowStyle]'>
        <slot name='renderRow' :item='{ text: rows[0], index: 0 }'>{{rows[0]}}</slot>
      </div>
    </div>
    <div class='marquee-custom'><slot /></div>
  </div>
</template>

<script>
import './index.scss'

export default {
  name: 'marquee',
  props: {
    /** 滚动的方向 */
    direction: {
      type: String,
      default: 'up',
      validator(value) {
        return ['up', 'down', 'left', 'right'].indexOf(value) >= 0
      },
    },

    /** 单个条目显示的时长 */
    duration: Number,

    /** 滚动的所有条目 */
    rows: {
      type: Array,
      required: true,
      validator(value) {
        return Array.isArray(value) && value.every(v => typeof v === 'string')
      },
    },
  },

  data() {
    return {
      trackStyle: {},
      rowStyle: {},
      lastRowStyle: {},
    }
  },

  computed: {
    coord() {
      return ['up', 'down'].indexOf(this.direction) >= 0 ? 'y' : 'x'
    },
  },

  mounted() {
    this.refresh()
    this.$watch('rows', () => this.refresh())
  },

  methods: {
    refresh() {
      const { rows } = this
      const { root } = this.$refs

      const width = root.clientWidth
      const height = root.clientHeight
      const duration = this.duration || (this.coord === 'x' ? 3500 : 1000)

      const trackStyle = {
        animationName: 'marquee-' + this.direction,
        animationDuration: duration * rows.length + 'ms',
      }
      const rowStyle = {
        width: width + 'px',
        height: height + 'px',
      }
      const lastRowStyle = {}

      if (this.coord === 'x') {
        trackStyle.width = rows.length * width + 'px'
        lastRowStyle.right = `-${width}px`
      } else {
        trackStyle.height = rows.length * height + 'px'
        lastRowStyle.bottom = `-${height}px`
      }

      this.trackStyle = trackStyle
      this.rowStyle = rowStyle
      this.lastRowStyle = lastRowStyle
    },
  },
}
</script>
