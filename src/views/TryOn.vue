<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { nets } from 'face-api.js'

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

onUnmounted(() => {
  if (streamRef) {
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
})
</script>

<template>
  <h1>Try on</h1>
  <h5 v-if="isLoadingModels">Loading models...</h5>
  <h5 v-if="errorMessage" aria-live="polite" aria-atomic="true">{{ errorMessage }}</h5>

  <div class="container">
    <img
      ref="imgElementRef"
      :width="VIDEO_FACE_MASK_SIZE"
      :height="VIDEO_FACE_MASK_SIZE"
      class="img"
      src=""
      alt="Your awesome photo"
    />
    <video
      ref="videoRef"
      :width="VIDEO_FACE_MASK_SIZE"
      :height="VIDEO_FACE_MASK_SIZE"
      poster="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
      autoplay
      muted
    />
    <canvas ref="canvasRef" :width="VIDEO_FACE_MASK_SIZE" :height="VIDEO_FACE_MASK_SIZE" />
    <audio
      ref="audioElementRef"
      src="https://res.cloudinary.com/dcqu0udnd/video/upload/v1702474052/camera-audio_z17u44.mp3"
      type="audio/mp3"
    ></audio>
  </div>

  <button @click="clearPhoto">Clear Photo</button>
  <button @click="takePhoto">Take Photo</button>

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
  display: inline-block;
  position: relative;
}

.img[src=''],
canvas,
audio,
.img:not([src='']) + video {
  display: none;
}
</style>
