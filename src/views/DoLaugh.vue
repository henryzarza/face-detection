<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import {
  nets,
  detectSingleFace,
  matchDimensions,
  resizeResults,
  draw,
  TinyFaceDetectorOptions
} from 'face-api.js'
import { VIDEO_FACE_DIMENSIONS } from '@/constants'
import overlayImg from '/images/overlay.png'

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

      if (detection?.expressions) {
        if (detection.expressions.happy > 0.7) {
          quantitySmiles.value += 1
        }
        if (detection.expressions.sad > 0.7 || detection.expressions.angry > 0.7) {
          quantitySmiles.value = 0
        }
      }
    } catch {
      console.error('Error detecting the face')
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
    isLoadingModels.value = false
  })

onMounted(() => (document.title = 'Do Laugh | Face Detection'))

onUnmounted(() => {
  clearInterval(intervalRef)
  if (streamRef) {
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
})
</script>

<template>
  <main class="bg-stone-100 min-h-[100vh] flex items-center justify-center pt-20 md:pt-0 pb-4">
    <section
      class="bg-white-transparent-50 max-w-[56.875rem] flex flex-col text-center md:px-8 md:py-6 px-4 py-4"
    >
      <h1 class="text-2xl text-stone-950 font-bold capitalize mb-5">Do Laugh</h1>
      <p class="text-base text-stone-950 mb-2 max-w-[30rem] mx-auto">
        The idea of this game is pretty simple: you watch a video and there is a counter that
        increments every time you laugh.
      </p>
      <h5 v-if="isLoadingModels" class="text-xl text-vermilion font-medium">Loading models...</h5>
      <h5
        v-if="errorMessage"
        class="text-xl text-vermilion font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ errorMessage }}
      </h5>

      <div class="flex flex-wrap gap-4 md:gap-12 mt-4">
        <iframe
          class="w-[28.125rem] h-[18.75rem] max-w-full"
          src="https://www.youtube.com/embed/Jz3_xAVxy5g?si=w1d7nTM7kgXfr58r"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>

        <div class="flex flex-col items-center">
          <div class="relative">
            <img
              class="w-[19rem] h-[19rem] max-w-full mb-3 relative z-10"
              src="/images/color-mark.png"
              alt="Color mark"
            />
            <video
              ref="videoRef"
              :width="VIDEO_FACE_DIMENSIONS.width"
              :height="VIDEO_FACE_DIMENSIONS.height"
              @playing="startDetection"
              :poster="overlayImg"
              class="absolute top-6 left-6"
              autoplay
              muted
            />
            <canvas ref="canvasRef" class="absolute top-6 left-6" />
          </div>
          <input
            type="checkbox"
            name="showFaceLandmarks"
            id="showFaceLandmarks"
            v-model="showFaceLandmarks"
            class="checkbox hidden"
          />
          <label
            for="showFaceLandmarks"
            class="relative text-base text-stone-950 cursor-pointer transition-colors pl-7 hover:text-vermilion before:w-6 before:h-6 before:rounded-md before:border-vermilion before:border-solid before:border-2 before:absolute before:left-0 after:content-['✓'] after:absolute after:left-1 after:font-black after:text-white after:scale-0 after:transition-transform"
          >
            Show face landmarks
          </label>
        </div>
      </div>

      <h4 class="text-base text-stone-950 mb-9 flex items-center justify-center">
        Quantity of smiles:
        <strong class="text-vermilion font-bold text-2xl ml-1">{{ quantitySmiles }}</strong>
      </h4>
      <p class="text-sm text-stone-950">
        If you want to restart the counter just make an angry 😠 or sad face 😞.
      </p>
    </section>
  </main>
</template>

<style scoped>
main {
  background-image: url('/images/party-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

section {
  backdrop-filter: blur(8px);
  box-shadow:
    -5px -5px 10px 0px rgba(0, 0, 0, 0.3),
    5px 5px 10px 0px rgba(0, 0, 0, 0.25);
}

.checkbox:checked + label::before {
  background-color: #f64d07;
}

.checkbox:checked + label::after {
  transform: scale(1);
}
</style>
