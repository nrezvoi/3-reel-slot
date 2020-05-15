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
          >{{ s.name }}</option>
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
          >{{ l.name }}</option>
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
          >{{ s.name }}</option>
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
          >{{ l.name }}</option>
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
          >{{ s.name }}</option>
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
          >{{ l.name }}</option>
        </select>
      </div>
    </div>
    <div class="flex space-x-3">
      <button
        :disabled="isRunning"
        @click="spin"
        class="inline-block p-2 mt-4 border border-gray-300 rounded cursor-pointer"
      >Spin</button>
    </div>
    <div class="relative inline-flex mt-4 space-x-3">
      <reel
        ref="reel1"
        @stop="onReelStop"
      />
      <reel
        ref="reel2"
        @stop="onReelStop"
      />
      <reel
        ref="reel3"
        @stop="onReelStop"
      />
      <div class="absolute flex flex-col w-full h-full justify-evenly">
        <div class="h-px bg-yellow-400"></div>
        <div class="h-px bg-yellow-400"></div>
        <div class="h-px bg-yellow-400"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import payTable from './data/payTable'
import lineTypes from './data/lines'
import symbolTypes from './data/symbols'

import Reel from './components/Reel'

export default {
  name: 'App',
  components: {
    Reel
  },
  data() {
    return {
      isRunning: false,
      userBalance: 5000,
      isDebug: true,
      symbolTypes: symbolTypes,
      lineTypes: lineTypes,
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
  computed: {
    availableDebugLines() {
      return lineTypes.filter(l => l.name !== 'any')
    }
  },
  methods: {
    spin() {
      this.isRunning = true
      if (this.isDebug) {
        const reel1Winner = {
          symbolId: this.debugReel1.symbol,
          line: { ...lineTypes.find(l => l.id === this.debugReel1.line) }
        }
        const reel2Winner = {
          symbolId: this.debugReel2.symbol,
          line: { ...lineTypes.find(l => l.id === this.debugReel2.line) }
        }
        const reel3Winner = {
          symbolId: this.debugReel3.symbol,
          line: { ...lineTypes.find(l => l.id === this.debugReel3.line) }
        }
        this.$refs.reel1.start(reel1Winner)
        this.$refs.reel2.start(reel2Winner)
        this.$refs.reel3.start(reel3Winner)

        setTimeout(() => {
          this.$refs.reel1.stop(reel1Winner)
          setTimeout(() => {
            this.$refs.reel2.stop(reel1Winner)
            setTimeout(() => {
              this.$refs.reel3.stop(reel1Winner)
              this.isRunning = false
            }, 500)
          }, 500)
        }, 2000)
      }
    },
    onReelStop() {
      this.isRunning = false
      console.log('reel stoppped!')
    }
  }
}
</script>