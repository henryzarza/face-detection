<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { nets } from 'face-api.js'
import overlayImg from '/images/overlay.png'

import { putMaskOnFace } from '@/utils'
import { MASKS, VIDEO_FACE_MASK_SIZE } from '@/constants'

const isLoadingModels = ref(true)
const isLoadingDetection = ref(false)
const errorMessage = ref()
const imgElementRef = ref()
const audioElementRef = ref()
const videoRef = ref()
const canvasRef = ref()
let streamRef: MediaStream

// loading models
Promise.all([
  nets.tinyFaceDetector.loadFromUri('/models'),
  nets.faceLandmark68TinyNet.loadFromUri('/models')
])
  .then(() => {
    isLoadingModels.value = false
    showCameraIntoVideo()
  })
  .catch((error: Error) => {
    errorMessage.value = `There was an error loading the models: ${error.name}`
  })

// request access to user's camera
const showCameraIntoVideo = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: VIDEO_FACE_MASK_SIZE },
        height: { ideal: VIDEO_FACE_MASK_SIZE },
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
        errorMessage.value = `The resolution ${VIDEO_FACE_MASK_SIZE}x${VIDEO_FACE_MASK_SIZE} px is not supported by your device.`
      } else if (error.name === 'NotAllowedError') {
        errorMessage.value = 'You need to grant this page permission to access your camera.'
      } else {
        errorMessage.value = `getUserMedia error: ${error.name}`
      }
    })
}

const takePhoto = () => {
  if (!imgElementRef.value.getAttribute('src')) {
    const context = canvasRef.value.getContext('2d')
    context.drawImage(videoRef.value, 0, 0, VIDEO_FACE_MASK_SIZE, VIDEO_FACE_MASK_SIZE)
    const data = canvasRef.value.toDataURL('image/png')
    imgElementRef.value.setAttribute('src', data)

    // play the camera audio
    audioElementRef.value.play()
    // stop using user's camera
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
}

const clearPhoto = () => {
  const context = canvasRef.value.getContext('2d')
  context.clearRect(0, 0, VIDEO_FACE_MASK_SIZE, VIDEO_FACE_MASK_SIZE)
  imgElementRef.value.setAttribute('src', '')
  // remove the old mask overlay
  const oldOverlay = imgElementRef.value.parentElement?.querySelector('#overlay')
  if (oldOverlay) {
    imgElementRef.value.parentElement?.removeChild(oldOverlay)
  }

  showCameraIntoVideo()
}

// select mask
const selectMask = (maskSrc: string) => {
  if (imgElementRef.value.getAttribute('src')) {
    isLoadingDetection.value = true

    putMaskOnFace(maskSrc, imgElementRef.value)
      .then((response) => {
        isLoadingDetection.value = !response
      })
      .catch((error: Error) => {
        isLoadingDetection.value = false
        errorMessage.value = error
      })
  } else errorMessage.value = 'You have to take a picture first 😉'
}

onMounted(() => (document.title = 'Try On | Face Detection'))

onUnmounted(() => {
  if (streamRef) {
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
})
</script>

<template>
  <main
    class="bg-stone-600 min-h-[100vh] flex items-center justify-center relative overflow-x-hidden pt-20 md:pt-0 pb-4"
  >
    <section
      class="bg-dark-transparent-60 border-2 border-solid border-gold rounded-lg backdrop:blur-sm max-w-[56.875rem] flex flex-col text-center md:px-8 md:py-6 px-4 py-4"
    >
      <h1 class="text-2xl text-gold font-bold capitalize mb-5">Try on</h1>
      <p class="text-base text-white mb-2 max-w-[25.5rem] mx-auto">
        <strong class="fw-bold">Privacy First:</strong> Facial Recognition is done in the browser
        itself. No video ever leaves your device.
      </p>

      <h5 v-if="isLoadingModels" class="text-xl text-gold font-medium">Loading models...</h5>
      <h5
        v-if="errorMessage"
        class="text-xl text-gold font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ errorMessage }}
      </h5>
      <h5 v-if="isLoadingDetection" class="text-xl text-gold font-medium">Running detection</h5>

      <div class="flex flex-wrap items-center justify-center md:gap-6 sm:gap-4 mt-6">
        <div class="relative">
          <img
            class="w-[25rem] h-[25rem] max-w-full mb-5"
            src="/images/wood-mark.png"
            alt="Wood mark"
          />
          <img
            ref="imgElementRef"
            :width="VIDEO_FACE_MASK_SIZE"
            :height="VIDEO_FACE_MASK_SIZE"
            class="absolute top-10 left-10 main-img"
            src=""
            alt="Your awesome photo"
          />
          <video
            ref="videoRef"
            class="absolute top-10 left-10"
            :width="VIDEO_FACE_MASK_SIZE"
            :height="VIDEO_FACE_MASK_SIZE"
            :poster="overlayImg"
            autoplay
            muted
          />
          <canvas
            ref="canvasRef"
            class="hidden"
            :width="VIDEO_FACE_MASK_SIZE"
            :height="VIDEO_FACE_MASK_SIZE"
          />
          <audio
            class="hidden"
            ref="audioElementRef"
            src="https://res.cloudinary.com/dcqu0udnd/video/upload/v1702474052/camera-audio_z17u44.mp3"
            type="audio/mp3"
          ></audio>

          <div class="flex flew-wrap md:gap-6 gap-3 justify-center">
            <button
              @click="clearPhoto"
              class="text-base text-gold font-bold py-2 px-3 border-2 border-solid border-gold transition-all hover:bg-white-transparent-50"
            >
              Clear Photo
            </button>
            <button
              @click="takePhoto"
              class="text-base text-stone-950 bg-gold font-bold py-2 px-3 border-2 border-solid border-gold transition-all hover:bg-white"
            >
              Take Photo
            </button>
          </div>
        </div>

        <div class="grid md:grid-cols-3 grid-cols-2 gap-3 md:mt-0 mt-3">
          <button
            v-for="mask of MASKS"
            :key="mask.src"
            @click="() => selectMask(mask.src)"
            class="w-full rounded-lg bg-white-transparent-50 p-2 transition-all hover:bg-white hover:scale-105"
          >
            <img width="100" height="100" :src="mask.src" :alt="mask.alt" />
          </button>
        </div>
      </div>
    </section>

    <img
      src="/images/mask.png"
      alt=""
      class="absolute hidden xl:block top-0 h-[100vh] -right-40 pointer-events-none z-20"
    />
  </main>
</template>

<style scoped>
main {
  background-image: url('/images/venezia-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.main-img[src=''],
.main-img:not([src='']) + video {
  display: none;
}
</style>
