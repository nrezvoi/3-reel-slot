<template>
  <div
    class="overflow-hidden"
    style="height:242px;width:141px"
  >
    <div
      v-if="isAnimationRunning"
      ref="spinContainer"
    >
      <div
        v-for="(s, i) in spinningSymbols"
        :key="i"
      >
        <img
          class="block"
          width="141"
          style="filter:blur(8px)"
          height="121"
          :src="s.imagePath"
          :alt="s.name"
        >
      </div>
    </div>
    <div v-else>
      <div :style="`transform: translateY(-${visiblePart.offset}px)`">
        <div
          v-for="(s, i) in visiblePart.symbols"
          :key="i"
        >
          <img
            class="block"
            width="141"
            height="121"
            :src="s.imagePath"
            :alt="s.name"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import symbolTypes from '../data/symbols'
import lineTypes from '../data/lines'

export default {
  name: 'reel',
  props: {
    isSpinning: {
      type: Boolean,
      default: false
    }
  },
  created() {
    const firstSymbol = this.spinningSymbols[0]
    const secondSymbol = this.spinningSymbols[1]
    this.spinningSymbols.push({ ...firstSymbol }, { ...secondSymbol })
    this.maxYOffset = this.height * (this.spinningSymbols.length - 2)
  },
  mounted() {
    // this.spinReel()
  },
  data() {
    return {
      isAnimationRunning: false,
      height: 121,
      maxYOffset: 0,
      offset: 0,
      spinningSymbols: JSON.parse(JSON.stringify(symbolTypes)),
      winnerSymbol: {
        id: symbolTypes[0].id,
        line: lineTypes[0]
      }
    }
  },
  computed: {
    visiblePart() {
      const symbols = []
      const winnerIndex = symbolTypes.findIndex(
        s => s.id === this.winnerSymbol.id
      )
      let offset = 0
      if (this.winnerSymbol.line.name === 'top') {
        const nextSymbolIndex =
          winnerIndex + 1 === symbolTypes.length ? 0 : winnerIndex + 1
        symbols.push(
          { ...symbolTypes[winnerIndex] },
          { ...symbolTypes[nextSymbolIndex] }
        )
      } else if (this.winnerSymbol.line.name === 'mid') {
        offset = this.height * 0.5
        const previosSymbolIndex =
          winnerIndex - 1 < 0 ? symbolTypes.length - 1 : winnerIndex - 1
        const nextSymbolIndex =
          winnerIndex + 1 === symbolTypes.length ? 0 : winnerIndex + 1
        symbols.push(
          { ...symbolTypes[previosSymbolIndex] },
          { ...symbolTypes[winnerIndex] },
          { ...symbolTypes[nextSymbolIndex] }
        )
      } else if (this.winnerSymbol.line.name === 'bot') {
        const previosSymbolIndex =
          winnerIndex - 1 < 0 ? symbolTypes.length - 1 : winnerIndex - 1
        symbols.push(
          { ...symbolTypes[previosSymbolIndex] },
          { ...symbolTypes[winnerIndex] }
        )
      }

      return {
        offset,
        symbols
      }
    }
  },
  methods: {
    start({ symbolId, line }) {
      this.winnerSymbol = {
        id: symbolId,
        line: line
      }
      this.isAnimationRunning = true
      this.$nextTick(() => {
        this._spinReel()
      })
    },
    _spinReel() {
      const speed = 50
      let that = this
      ;(function animate() {
        if (that.offset >= that.maxYOffset) {
          that.$refs.spinContainer.style.transform = `translateY(0)`
          that.offset = 0
        } else {
          that.$refs.spinContainer.style.transform = `translateY(-${that.offset}px)`
        }
        that.offset += speed
        requestAnimationFrame(animate)
      })()
    },
    stop() {
      if (!this.isAnimationRunning) {
        return
      }
      this.$refs.spinContainer.removeEventListener(
        'transitionend',
        this.$refs.spinContainer['_animCallback']
      )
      // wait for all transitions to finish
      this.$refs.spinContainer.addEventListener('transitionend', () => {
        this.isAnimationRunning = false
        this.$emit('stop')
      })
    }
  }
}
</script>