<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import {
  nets,
  detectSingleFace,
  matchDimensions,
  resizeResults,
  draw,
  TinyFaceDetectorOptions
} from 'face-api.js'
import { VIDEO_FACE_DIMENSIONS } from '@/constants'

const videoRef = ref()
const canvasRef = ref()
const isLoadingModels = ref(true)
const errorMessage = ref()
const quantitySmiles = ref(0)
const showFaceLandmarks = ref(true)
let streamRef: MediaStream
let intervalRef: string | number | NodeJS.Timeout | undefined

// request access to user's camera
const showCameraIntoVideo = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: VIDEO_FACE_DIMENSIONS.width },
        height: { ideal: VIDEO_FACE_DIMENSIONS.height },
        facingMode: 'user'
      },
      audio: false
    })
    .then((stream) => {
      streamRef = stream

      // render the camera stream into the video
      videoRef.value.srcObject = streamRef
      matchDimensions(canvasRef.value, VIDEO_FACE_DIMENSIONS)
    })
    .catch((error: Error) => {
      if (error.name === 'OverconstrainedError') {
        errorMessage.value = `The resolution ${VIDEO_FACE_DIMENSIONS.width}x${VIDEO_FACE_DIMENSIONS.height} px is not supported by your device.`
      } else if (error.name === 'NotAllowedError') {
        errorMessage.value = 'You need to grant this page permission to access your camera.'
      } else {
        errorMessage.value = `getUserMedia error: ${error.name}`
      }
    })
}

const startDetection = () => {
  intervalRef = setInterval(async () => {
    try {
      const detection = await detectSingleFace(videoRef.value, new TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

      const resizedDetection = resizeResults(detection, VIDEO_FACE_DIMENSIONS)

      canvasRef.value
        .getContext('2d')
        ?.clearRect(0, 0, VIDEO_FACE_DIMENSIONS.width, VIDEO_FACE_DIMENSIONS.height)
      if (resizedDetection && showFaceLandmarks.value) {
        draw.drawFaceLandmarks(canvasRef.value, resizedDetection)
        draw.drawFaceExpressions(canvasRef.value, resizedDetection)
      }

      if (detection && detection.expressions) {
        if (detection.expressions.happy > 0.7) {
          quantitySmiles.value += 1
        }
        if (detection.expressions.sad > 0.7 || detection.expressions.angry > 0.7) {
          quantitySmiles.value = 0
        }
      }
    } catch {
      errorMessage.value = 'Error detecting the face'
    }
  }, 200)
}

// loading models
Promise.all([
  nets.tinyFaceDetector.loadFromUri('/models'),
  nets.faceLandmark68Net.loadFromUri('/models'),
  nets.faceRecognitionNet.loadFromUri('/models'),
  nets.faceExpressionNet.loadFromUri('/models')
])
  .then(() => {
    isLoadingModels.value = false
    showCameraIntoVideo()
  })
  .catch((error: Error) => {
    errorMessage.value = `There was an error loading the models: ${error.name}`
  })

onUnmounted(() => {
  clearInterval(intervalRef)
  if (streamRef) {
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
})
</script>

<template>
  <h1>Show me your smile</h1>
  <h5 v-if="isLoadingModels">Loading models...</h5>
  <h5 v-if="errorMessage" aria-live="polite" aria-atomic="true">{{ errorMessage }}</h5>
  <h4>Quantity of smiles: {{ quantitySmiles }}</h4>
  <p>If you want to restart the counter just make an angry or sad face for the camera 😄</p>

  <fieldset>
    <label for="showFaceLandmarks">Show face landmarks</label>
    <input
      type="checkbox"
      name="showFaceLandmarks"
      id="showFaceLandmarks"
      v-model="showFaceLandmarks"
    />
  </fieldset>

  <div class="container">
    <video
      ref="videoRef"
      :width="VIDEO_FACE_DIMENSIONS.width"
      :height="VIDEO_FACE_DIMENSIONS.height"
      @playing="startDetection"
      autoplay
      muted
    />
    <canvas ref="canvasRef" />
  </div>

  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/IOwLVfO_xZM?si=W7hnLDCkTd3HfYLE"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</template>

<style scoped>
.container {
  position: relative;
}

.container canvas {
  position: absolute;
  inset: 0;
}
</style>
