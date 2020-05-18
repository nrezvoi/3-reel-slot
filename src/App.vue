<template>
  <div class="container min-h-screen p-4 mx-auto text-gray-200">
    <div class="grid justify-center grid-flow-col grid-rows-3">
      <div
        v-for="(type, i) in rulesTable"
        :key="i"
        class="grid items-center gap-2 text-sm leading-none"
        style="grid-template-columns: 120px 85px 60px 85px"
        :class="{'blinking': type.isWin}"
      >
        <div class="flex">
          <img
            v-for="(imagePath, m) in type.symbols"
            :src="imagePath"
            :key="m"
            alt="symbol"
            width="40"
            height="34"
          >
        </div>
        <div>{{ type.combination ? 'Combination' : 'Match' }}</div>
        <div>{{ type.line }} line</div>
        <div class="font-bold text-center">{{ type.payout }}</div>
      </div>
    </div>
    <div class="flex justify-center mt-8">
      <div class="relative">

        <div
          class="absolute flex flex-col w-full justify-evenly"
          style="height: 234px; top: calc(50% - 117px)"
        >
          <div
            class="h-1"
            :class="winLineStyle('top')"
          ></div>
          <div
            class="h-1"
            :class="winLineStyle('mid')"
          ></div>
          <div
            class="h-1"
            :class="winLineStyle('bot')"
          ></div>
        </div>
        <div class="flex p-4 space-x-3 bg-gray-900 border-2 border-pink-500 rounded">
          <div
            class="relative bg-gray-300 border-2 border-blue-500 rounded"
            style="border-width: 4px"
          >
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
            <div class="absolute top-0 left-0 z-20 w-full h-12 gradient-to-bottom"></div>
            <div class="absolute bottom-0 left-0 z-20 w-full h-12 gradient-to-top"></div>
          </div>
          <div
            class="relative bg-gray-300 border-2 border-blue-500 rounded"
            style="border-width: 4px"
          >
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
            <div class="absolute top-0 left-0 z-20 w-full h-12 gradient-to-bottom"></div>
            <div class="absolute bottom-0 left-0 z-20 w-full h-12 gradient-to-top"></div>
          </div>
          <div
            class="relative bg-gray-300 border-2 border-blue-500 rounded"
            style="border-width: 4px"
          >
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
            <div class="absolute top-0 left-0 z-20 w-full h-12 gradient-to-bottom"></div>
            <div class="absolute bottom-0 left-0 z-20 w-full h-12 gradient-to-top"></div>
          </div>
        </div>

      </div>
    </div>
    <div class="flex justify-center mt-4 space-x-8">
      <div class="w-64 space-y-4">
        <div>
          <div>
            Balance:
            <input
              type="number"
              v-model="config.PLAYER_BALANCE"
              :disabled="config.RUNNING"
              class="w-16 ml-4 text-yellow-400 bg-gray-700"
              min="1"
              max="5000"
              size="5"
            >
          </div>
        </div>
        <button
          @click="spin"
          :disabled="config.RUNNING"
          class="inline-block p-2 border-2 border-gray-300 rounded cursor-pointer"
          :class="{'cursor-not-allowed': config.RUNNING}"
        >Spin</button>
        <div class="space-x-2">
          <label for="debug">Fixed mode</label>
          <input
            type="checkbox"
            v-model="config.IS_FIXED"
            id="debug"
            :disabled="config.RUNNING"
          >
        </div>
        <div
          v-if="config.IS_FIXED"
          class="flex space-x-3"
        >
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
                v-for="(l, i) in availableLines"
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
                v-for="(l, i) in availableLines"
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
                v-for="(l, i) in availableLines"
                :key="i"
                :value="l.id"
              >{{ l.id }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import payTable from './data/payTable'
import lineTypes from './data/lines'
import symbolTypes from './data/symbols'

export default {
  name: 'App',
  data() {
    return {
      config: {
        IS_FIXED: false,
        SLOT_SPEED: 40,
        SYMBOL_COUNT: 5,
        IMAGE_HEIGHT: 121,
        IMAGE_WIDTH: 141,
        DURATION: 2000,
        DELAY: 500,
        RUNNING: false,
        MAX_Y_OFFSET: 363,
        PLAYER_BALANCE: 10
      },
      symbolTypes: symbolTypes,
      lineTypes: lineTypes,
      winLines: {
        top: false,
        mid: false,
        bot: false
      },
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
      },
      rulesTable: JSON.parse(JSON.stringify(payTable)).map(type => {
        type.isWin = false
        type.symbols = type.symbols.map(
          s => symbolTypes.find(t => s === t.id).imagePath
        )
        return type
      })
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
    availableLines() {
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
    winLineStyle(line) {
      if (this.winLines[line]) {
        return ['z-30', 'bg-yellow-600']
      } else {
        return ['bg-green-400']
      }
    },
    spin() {
      this.reset()
      if (this.config.PLAYER_BALANCE <= 0) {
        alert('Insufficient funds!')
      } else {
        this.config.PLAYER_BALANCE -= 1
        this.config.RUNNING = true
        this.start()
      }
    },
    reset() {
      this.rulesTable.forEach(rule => {
        rule.isWin = false
      })
      Object.keys(this.winLines).forEach(k => {
        this.winLines[k] = false
      })
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

      let winners = {
        reel1: null,
        reel2: null,
        reel3: null
      }

      for (let i = 1; i <= 3; i++) {
        if (!this.config.IS_FIXED) {
          const randomSymbolId =
            symbolTypes[Math.floor(Math.random() * symbolTypes.length)].id
          const randomLine = this.availableLines[
            Math.floor(Math.random() * this.availableLines.length)
          ].id
          const lineCoeff = this.lineCoeff[randomLine]

          winners[`reel${i}`] = {
            id: randomSymbolId,
            line: {
              id: randomLine,
              coeff: lineCoeff
            }
          }
        } else {
          const symbolId = this[`debugReel${i}`].symbol
          const lineId = this[`debugReel${i}`].line
          const lineCoeff = this.lineCoeff[lineId]
          winners[`reel${i}`] = {
            id: symbolId,
            line: {
              id: lineId,
              coeff: lineCoeff
            }
          }
        }
      }

      setTimeout(() => {
        stopAt.reel1 = winners.reel1
        setTimeout(() => {
          stopAt.reel2 = winners.reel2
          setTimeout(() => {
            stopAt.reel3 = winners.reel3
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

      for (let win of winLines) {
        this.winLines[win.line] = true
        const rule = this.rulesTable.find(r => r.id === win.type.id)
        rule.isWin = true
        this.config.PLAYER_BALANCE += rule.payout
      }
    }
  }
}
</script>

<style>
.blinking {
  animation: blink-animation 1s step-start infinite;
}

@keyframes blink-animation {
  50% {
    background: #d69e2e;
  }
}

.gradient-to-bottom {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
.gradient-to-top {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
