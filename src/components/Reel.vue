<template>
  <div
    class="overflow-hidden"
    style="height:242px;width:141px"
  >
    <div
      v-if="isSpinning"
      ref="spinContainer"
    >
      <div
        v-for="(s, i) in spinningSymbols"
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
    this.maxYOffset = this.height * this.spinningSymbols.length - 2
  },
  mounted() {
    // this.spinReel()
  },
  data() {
    return {
      height: 121,
      maxYOffset: 0,
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
      } else {
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
    spinReel() {
      this.$refs.spinContainer.style.willChange = 'transform'
      const startSpinning = () => {
        this.$refs.spinContainer.style.transition = 'transform 0.2s linear'
        requestAnimationFrame(() => {
          this.$refs.spinContainer.style.transform = `translateY(-${this.maxYOffset}px)`
        })
      }
      const callback = () => {
        this.$refs.spinContainer.style.transition = null
        requestAnimationFrame(() => {
          this.$refs.spinContainer.style.transform = `translateY(-${0}px)`
          requestAnimationFrame(() => {
            startSpinning()
          })
        })
      }
      startSpinning()
      this.$refs.spinContainer.addEventListener('transitionend', callback)
    },
    stopReel() {
      console.log('stopped')
    }
  },
  watch: {
    isSpinning(n) {
      if (n) {
        setTimeout(() => {
          this.$nextTick(this.spinReel)
        }, 0)
      }
    }
  }
}
</script>