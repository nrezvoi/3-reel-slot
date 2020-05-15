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
            v-for="(l, i) in lineTypes"
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
            v-for="(l, i) in lineTypes"
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
            v-for="(l, i) in lineTypes"
            :key="i"
            :value="l.id"
          >{{ l.name }}</option>
        </select>
      </div>
    </div>
    <div class="flex space-x-3">
      <button
        @click="spin"
        class="inline-block p-2 mt-4 border border-gray-300 rounded cursor-pointer"
      >Spin</button>
      <button
        @click="stopSpin"
        class="inline-block p-2 mt-4 border border-gray-300 rounded cursor-pointer"
      >Stop</button>
    </div>
    <div class="flex mt-4 space-x-3">
      <reel :is-spinning="isSpinning" />
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
      isSpinning: false,
      userBalance: 5000,
      isDebug: false,
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
  methods: {
    spin() {
      this.isSpinning = true
    },
    stopSpin() {
      this.isSpinning = false
    }
  }
}
</script>