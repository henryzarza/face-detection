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

const videoRef = ref()
const canvasRef = ref()
const isLoadingModels = ref(true)
const videoConstraints = {
  width: 450,
  height: 300
}
const errorMessage = ref()
let intervalRef: string | number | NodeJS.Timeout | undefined
let streamRef: MediaStream

// request access to user's camera
const renderVideo = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: videoConstraints.width },
        height: { ideal: videoConstraints.height },
        facingMode: 'user'
      },
      audio: false
    })
    .then((stream) => {
      streamRef = stream

      // render the camera stream into the video
      videoRef.value.srcObject = streamRef
    })
    .catch((error: Error) => {
      if (error.name === 'OverconstrainedError') {
        errorMessage.value = `The resolution ${videoConstraints.width}x${videoConstraints.height} px is not supported by your device.`
      } else if (error.name === 'NotAllowedError') {
        errorMessage.value = 'You need to grant this page permission to access your camera.'
      } else {
        errorMessage.value = `getUserMedia error: ${error.name}`
      }
    })
}

const handlePlayVideo = () => {
  matchDimensions(canvasRef.value, videoConstraints)

  intervalRef = setInterval(async () => {
    const detection = await detectSingleFace(videoRef.value, new TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
    const resizedDetection = resizeResults(detection, videoConstraints)

    if (resizedDetection) {
      canvasRef.value
        .getContext('2d')
        ?.clearRect(0, 0, videoConstraints.width, videoConstraints.height)
      draw.drawFaceLandmarks(canvasRef.value, resizedDetection)
      draw.drawFaceExpressions(canvasRef.value, resizedDetection)
    }

    if (detection && detection.expressions) {
      if (detection.expressions.happy > 0.7) {
        console.info('Smiling')
      }
      if (detection.expressions.fearful > 0.7) {
        console.info('Fearful')
      }
      if (detection.expressions.sad > 0.7) {
        console.info('Sad')
      }
      if (detection.expressions.surprised > 0.7) {
        console.info('Surprised')
      }
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
    renderVideo()
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
  <h1>Home Page</h1>
  <h5 v-if="isLoadingModels">Loading models...</h5>
  <h5 v-if="errorMessage" aria-live="polite" aria-atomic="true">{{ errorMessage }}</h5>
  <div class="container">
    <video
      ref="videoRef"
      :width="videoConstraints.width"
      :height="videoConstraints.height"
      @playing="handlePlayVideo"
      autoplay
      muted
    />
    <canvas ref="canvasRef" />
  </div>
  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/nCkpzqqog4k?si=wGXMTYAjqjwrQZbG"
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
