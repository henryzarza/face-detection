<script setup lang="ts">
import { ref } from 'vue'
import { nets } from 'face-api.js'

import { putMaskOnFace } from '@/utils'
import { MASKS } from '@/constants'

const isLoadingModels = ref(true)
const isLoadingDetection = ref(false)
const errorMessage = ref()
const imgContainerRef = ref()
const imgElementRef = ref()

// loading models
Promise.all([
  nets.tinyFaceDetector.loadFromUri('/models'),
  nets.faceLandmark68TinyNet.loadFromUri('/models')
])
  .then(() => {
    isLoadingModels.value = false
  })
  .catch((error: Error) => {
    errorMessage.value = `There was an error loading the models: ${error.name}`
  })

// select mask
const selectMask = (maskSrc: string) => {
  isLoadingDetection.value = true

  putMaskOnFace(maskSrc, imgElementRef.value, imgContainerRef.value)
    .then((response) => {
      isLoadingDetection.value = !response
    })
    .catch((error: Error) => {
      isLoadingDetection.value = false
      errorMessage.value = error.name
    })
}

/* onUnmounted(() => {
  if (streamRef) {
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
}) */
</script>

<template>
  <h1>Try on</h1>
  <h5 v-if="isLoadingModels">Loading models...</h5>
  <h5 v-if="errorMessage" aria-live="polite" aria-atomic="true">{{ errorMessage }}</h5>

  <div class="container" ref="imgContainerRef">
    <img
      ref="imgElementRef"
      width="300"
      height="300"
      src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-1356675370.jpg?crop=1xw:1.0xh;center,top&resize=640:*"
      alt="User photo"
    />
    <canvas id="canvasTest" width="300" height="300"></canvas>
  </div>

  <button>Take photo</button>

  <h6 v-if="isLoadingDetection">Running detection</h6>

  <h4>Select a mask</h4>
  <div>
    <button v-for="mask of MASKS" :key="mask.src" @click="() => selectMask(mask.src)">
      <img width="300" height="300" :src="mask.src" :alt="mask.alt" />
    </button>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid green;
  display: inline-block;
  position: relative;
}

canvas {
  position: absolute;
  inset: 0;
  border: 1px solid blue;
}
</style>
