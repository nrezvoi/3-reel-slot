<template>
  <div class="min-h-screen text-gray-200 bg-gray-800">
    <div class="flex space-x-3">
      <div>
        <div class="font-bold">Reel 1</div>
        <select
          class="block mt-2 bg-gray-700"
          id="debugReel1-symbol"
          v-model="debugReel1.symbol"
        >
          <option
            v-for="(s, i) in symbolTypes"
            :key="i"
            :value="s.id"
          >{{ s.id }}</option>
        </select>
        <select
          class="block mt-2 bg-gray-700"
          id="debugReel1-line"
          v-model="debugReel1.line"
        >
          <option
            v-for="(l, i) in availableDebugLines"
            :key="i"
            :value="l.id"
          >{{ l.id }}</option>
        </select>
      </div>
      <div>
        <div class="font-bold">Reel 2</div>
        <select
          class="block mt-2 bg-gray-700"
          id="debugReel2-symbol"
          v-model="debugReel2.symbol"
        >
          <option
            v-for="(s, i) in symbolTypes"
            :key="i"
            :value="s.id"
          >{{ s.id }}</option>
        </select>
        <select
          class="block mt-2 bg-gray-700"
          id="debugReel2-line"
          v-model="debugReel2.line"
        >
          <option
            v-for="(l, i) in availableDebugLines"
            :key="i"
            :value="l.id"
          >{{ l.id }}</option>
        </select>
      </div>
      <div>
        <div class="font-bold">Reel 3</div>
        <select
          class="block mt-2 bg-gray-700"
          id="debugReel2-symbol"
          v-model="debugReel3.symbol"
        >
          <option
            v-for="(s, i) in symbolTypes"
            :key="i"
            :value="s.id"
          >{{ s.id }}</option>
        </select>
        <select
          class="block mt-2 bg-gray-700"
          id="debugReel3-line"
          v-model="debugReel3.line"
        >
          <option
            v-for="(l, i) in availableDebugLines"
            :key="i"
            :value="l.id"
          >{{ l.id }}</option>
        </select>
      </div>
    </div>
    <div class="flex space-x-3">
      <button
        @click="spin"
        :disabled="config.RUNNING"
        class="inline-block p-2 mt-4 border border-gray-300 rounded cursor-pointer"
      >Spin</button>
    </div>
    <div class="relative inline-flex mt-4">
      <div class="flex space-x-3">
        <div
          :style="{ 'height': `${reelDimensions.height}px`, 'width': `${reelDimensions.width}px` }"
          class="relative z-10 overflow-hidden"
        >
          <div ref="reel1">
            <img
              v-for="(s, i) in reel1"
              :key="i"
              class="block"
              :width="config.IMAGE_WIDTH"
              :height="config.IMAGE_HEIGHT"
              :src="s.imagePath"
              :alt="s.name"
            >
          </div>
        </div>
        <div
          :style="{ 'height': `${reelDimensions.height}px`, 'width': `${reelDimensions.width}px` }"
          class="relative z-10 overflow-hidden"
        >
          <div ref="reel2">
            <img
              v-for="(s, i) in reel2"
              :key="i"
              class="block"
              :width="config.IMAGE_WIDTH"
              :height="config.IMAGE_HEIGHT"
              :src="s.imagePath"
              :alt="s.name"
            >
          </div>
        </div>
        <div
          :style="{ 'height': `${reelDimensions.height}px`, 'width': `${reelDimensions.width}px` }"
          class="relative z-10 overflow-hidden"
        >
          <div ref="reel3">
            <img
              v-for="(s, i) in reel3"
              :key="i"
              class="block"
              :width="config.IMAGE_WIDTH"
              :height="config.IMAGE_HEIGHT"
              :src="s.imagePath"
              :alt="s.name"
            >
          </div>
        </div>
      </div>
      <div class="absolute flex flex-col w-full h-full justify-evenly">
        <div class="h-px bg-green-400"></div>
        <div class="h-px bg-green-400"></div>
        <div class="h-px bg-green-400"></div>
      </div>
    </div>
  </div>
</template>

<script>
import payTable from './data/payTable'
import lineTypes from './data/lines'
import symbolTypes from './data/symbols'

// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i
//     ;[array[i], array[j]] = [array[j], array[i]]
//   }
//   return array
// }

export default {
  name: 'App',
  data() {
    return {
      config: {
        SLOT_SPEED: 40,
        SYMBOL_COUNT: 5,
        IMAGE_HEIGHT: 121,
        IMAGE_WIDTH: 141,
        DURATION: 2000,
        DELAY: 500,
        RUNNING: false,
        MAX_Y_OFFSET: 363
      },
      symbolTypes: symbolTypes,
      lineTypes: lineTypes,
      reel1: [],
      reel2: [],
      reel3: [],
      latestOffsets: {
        reel1: 0,
        reel2: 0,
        reel3: 0
      },
      debugReel1: {
        symbol: symbolTypes[0].id,
        line: lineTypes[0].id
      },
      debugReel2: {
        symbol: symbolTypes[0].id,
        line: lineTypes[0].id
      },
      debugReel3: {
        symbol: symbolTypes[0].id,
        line: lineTypes[0].id
      }
    }
  },
  created() {
    this.reel1 = [...symbolTypes]
    this.reel2 = [...symbolTypes]
    this.reel3 = [...symbolTypes]
  },
  mounted() {
    // this.start()
  },
  computed: {
    reelDimensions() {
      return {
        width: this.config.IMAGE_WIDTH,
        height: this.config.IMAGE_HEIGHT * 2
      }
    },
    availableDebugLines() {
      return lineTypes.filter(l => l.id !== 'any')
    },
    lineCoeff() {
      return {
        top: 0,
        mid: 0.5,
        bot: 1
      }
    }
  },
  methods: {
    spin() {
      this.config.RUNNING = true
      this.start()
    },
    start() {
      let that = this
      let offsets = {
        reel1: this.latestOffsets.reel1,
        reel2: this.latestOffsets.reel2,
        reel3: this.latestOffsets.reel3
      }
      let stopAt = {
        reel1: null,
        reel2: null,
        reel3: null
      }
      let stopped = {
        reel1: false,
        reel2: false,
        reel3: false
      }
      let visibleOnLines = {
        reel1: [],
        reel2: [],
        reel3: []
      }
      ;(function loop() {
        for (let i = 1; i <= 3; i++) {
          if (stopped[`reel${i}`]) {
            continue
          }
          if (offsets[`reel${i}`] >= that.config.MAX_Y_OFFSET) {
            const arr = that[`reel${i}`].slice(0, 3)
            that.$refs[`reel${i}`].style.transform = `translateY(0)`
            that[`reel${i}`].splice(0, 3)
            that[`reel${i}`].push(...arr)
            offsets[`reel${i}`] = 0
          }
          that.$refs[`reel${i}`].style.transform = `translateY(-${
            offsets[`reel${i}`]
          }px)`
          offsets[`reel${i}`] += that.config.SLOT_SPEED
          if (stopAt[`reel${i}`]) {
            const stopIndex = that[`reel${i}`].findIndex(
              s => s.id === stopAt[`reel${i}`].id
            )

            if (
              stopIndex > 0 &&
              stopIndex * that.config.IMAGE_HEIGHT <= that.config.MAX_Y_OFFSET
            ) {
              const offsetPos = Math.abs(
                stopIndex * that.config.IMAGE_HEIGHT -
                  that.config.IMAGE_HEIGHT * stopAt[`reel${i}`].line.coeff
              )

              if (offsets[`reel${i}`] >= offsetPos) {
                if (stopAt[`reel${i}`].line.id === 'mid') {
                  visibleOnLines[`reel${i}`].push(
                    that[`reel${i}`][stopIndex].id
                  )
                } else if (stopAt[`reel${i}`].line.id === 'top') {
                  visibleOnLines[`reel${i}`].push(
                    that[`reel${i}`][stopIndex].id
                  )
                  visibleOnLines[`reel${i}`].push(
                    that[`reel${i}`][stopIndex + 1].id
                  )
                } else {
                  visibleOnLines[`reel${i}`].push(
                    that[`reel${i}`][stopIndex - 1].id
                  )
                  visibleOnLines[`reel${i}`].push(
                    that[`reel${i}`][stopIndex].id
                  )
                }
                that.$refs[
                  `reel${i}`
                ].style.transform = `translateY(-${offsetPos}px)`
                stopAt[`reel${i}`] = null
                stopped[`reel${i}`] = true
                that.latestOffsets[`reel${i}`] = offsetPos
              }
            }
          }
        }

        if (Object.values(stopped).every(v => v)) {
          that.config.RUNNING = false
          that.determineWinners(visibleOnLines)
        }
        if (that.config.RUNNING) {
          requestAnimationFrame(loop)
        }
      })()
      setTimeout(() => {
        stopAt.reel1 = {
          id: this.debugReel1.symbol,
          line: {
            id: this.debugReel1.line,
            coeff: this.lineCoeff[this.debugReel1.line]
          }
        }
        setTimeout(() => {
          stopAt.reel2 = {
            id: this.debugReel2.symbol,
            line: {
              id: this.debugReel2.line,
              coeff: this.lineCoeff[this.debugReel2.line]
            }
          }
          setTimeout(() => {
            stopAt.reel3 = {
              id: this.debugReel3.symbol,
              line: {
                id: this.debugReel3.line,
                coeff: this.lineCoeff[this.debugReel3.line]
              }
            }
          }, this.config.DELAY)
        }, this.config.DELAY)
      }, this.config.DURATION)
    },
    determineWinners(visibleOnLines) {
      const lines = {
        top: [],
        mid: [],
        bot: []
      }
      for (let i = 1; i <= 3; i++) {
        const reel = visibleOnLines[`reel${i}`]
        if (reel.length === 1) {
          lines.top.push('x')
          lines.mid.push(reel[0])
          lines.bot.push('x')
        } else {
          lines.top.push(reel[0])
          lines.mid.push('x')
          lines.bot.push(reel[1])
        }
      }

      const winLines = []

      Object.keys(lines).forEach(line => {
        payTable.forEach(type => {
          if (!lines[line].added) {
            if (type.line !== 'any') {
              if (
                line === type.line &&
                lines[line].toString() === type.symbols.toString()
              ) {
                winLines.push({
                  line: line,
                  type: { ...type }
                })
                lines[line].added = true
              }
            } else {
              if (!type.combination) {
                if (lines[line].toString() === type.symbols.toString()) {
                  winLines.push({
                    line: line,
                    type: { ...type }
                  })
                  lines[line].added = true
                }
              } else {
                if (lines[line].every(l => type.symbols.includes(l))) {
                  winLines.push({
                    line: line,
                    type: { ...type }
                  })
                  lines[line].added = true
                }
              }
            }
          }
        })
      })
      console.log(winLines)
    }
  }
}
</script>
