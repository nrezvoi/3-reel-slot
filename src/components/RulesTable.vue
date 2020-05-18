<template>
  <div class="grid justify-center grid-flow-col grid-rows-3">
    <div
      v-for="(type, i) in data"
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
</template>

<script>
export default {
  name: 'rules-table',
  props: ['data']
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
</style>