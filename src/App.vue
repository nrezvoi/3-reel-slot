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
          ref="reel1Container"
          :style="{ 'height': `${reelDimensions.height}px`, 'width': `${reelDimensions.width}px` }"
          class="overflow-hidden"
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
      </div>
      <!-- <div class="absolute flex flex-col w-full h-full justify-evenly">
        <div class="h-px bg-yellow-400"></div>
        <div class="h-px bg-yellow-400"></div>
        <div class="h-px bg-yellow-400"></div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import payTable from './data/payTable'
import lineTypes from './data/lines'
import symbolTypes from './data/symbols'

// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i
//     ;[array[i], array[j]] = [array[j], array[i]]
//   }
// }

export default {
  name: 'App',
  data() {
    return {
      config: {
        SLOT_SPEED: 20,
        SYMBOL_COUNT: 5,
        IMAGE_HEIGHT: 121,
        IMAGE_WIDTH: 141,
        DURATION: 2000,
        RUNNING: false,
        MAX_Y_OFFSET: 363
      },
      symbolTypes: symbolTypes,
      lineTypes: lineTypes,
      reel1: [],
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
    const symbols = [...symbolTypes]
    this.reel1 = symbols
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
      let stopAt = null
      let offset = 0
      ;(function loop() {
        if (stopAt) {
          const stopIndex = that.reel1.findIndex(s => s.id === stopAt.id)

          if (
            stopIndex > 0 &&
            stopIndex * that.config.IMAGE_HEIGHT <= that.config.MAX_Y_OFFSET
          ) {
            const offsetPos = Math.abs(
              stopIndex * that.config.IMAGE_HEIGHT -
                that.config.IMAGE_HEIGHT * stopAt.lineCoeff
            )

            if (offset >= offsetPos) {
              that.$refs.reel1.style.transform = `translateY(-${offsetPos}px)`
              that.config.RUNNING = false
              stopAt = null
              return
            }
          }
        }
        if (offset >= that.config.MAX_Y_OFFSET) {
          const arr = that.reel1.slice(0, 3)
          that.$refs.reel1.style.transform = `translateY(0)`
          that.reel1.splice(0, 3)
          that.reel1.push(...arr)
          offset = 0
        }
        that.$refs.reel1.style.transform = `translateY(-${offset}px)`
        offset += that.config.SLOT_SPEED
        if (that.config.RUNNING) {
          requestAnimationFrame(loop)
        }
      })()
      setTimeout(() => {
        stopAt = {
          id: this.debugReel1.symbol,
          lineCoeff: this.lineCoeff[this.debugReel1.line]
        }
      }, this.config.DURATION)
    }
  }
}
</script>