<script setup lang="ts">
import { MAX_VOLUME, VOLUME_STEPS } from '@/constants'

const { modelValue } = defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    type="range"
    class="w-full cursor-pointer rounded-lg focus:outline-none bg-mine-shaft"
    min="0"
    :style="{ '--slider-percent': (Number(modelValue) / MAX_VOLUME) * 100 }"
    :max="MAX_VOLUME"
    :step="VOLUME_STEPS"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
input[type='range'] {
  --slider-percent: 50;
  -webkit-appearance: none;
  height: 4px;
}

input[type='range']::-webkit-slider-runnable-track {
  background: linear-gradient(to right, #ec1850 calc(var(--slider-percent) * 1%), transparent 0);
  border-radius: 0.5rem;
  height: 4px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: #ec1850;
  border-radius: 50%;
  height: 1rem;
  margin-top: -0.3rem;
  width: 1rem;
}
</style>
