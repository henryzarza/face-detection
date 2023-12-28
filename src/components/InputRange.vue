<script setup lang="ts">
import { ref } from 'vue'
import { MAX_VOLUME, VOLUME_STEPS } from '@/constants'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const rangeRef = ref()

const onInput = (value: string) => {
  const percent = (Number(value) / MAX_VOLUME) * 100
  rangeRef.value.style.setProperty('--slider-percent', percent)

  emit('update:modelValue', value)
}
</script>

<template>
  <input
    type="range"
    class="w-full cursor-pointer rounded-lg focus:outline-none bg-mine-shaft"
    ref="rangeRef"
    min="0"
    :max="MAX_VOLUME"
    :step="VOLUME_STEPS"
    :value="modelValue"
    @input="onInput(($event.target as HTMLInputElement).value)"
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
