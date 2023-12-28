<script setup lang="ts">
import { ref, onUnmounted, onMounted, watch } from 'vue'
import {
  nets,
  detectSingleFace,
  matchDimensions,
  resizeResults,
  draw,
  TinyFaceDetectorOptions
} from 'face-api.js'

import {
  PLAY_LIST,
  MAX_VOLUME,
  VOLUME_STEPS,
  VIDEO_FACE_MUSIC_DIMENSIONS,
  EXPRESSIONS_COMMANDS
} from '@/constants'
import cellphone from '/images/cellphone.png'
import overlayImg from '/images/overlay.png'
import Mute from '@/components/Icons/Mute.vue'
import Next from '@/components/Icons/Next.vue'
import Pause from '@/components/Icons/Pause.vue'
import Play from '@/components/Icons/Play.vue'
import Volume from '@/components/Icons/Volume.vue'
import InputRange from '@/components/InputRange.vue'

const videoRef = ref()
const canvasRef = ref()
const isLoadingModels = ref(true)
const errorMessage = ref()
let streamRef: MediaStream
let intervalRef: string | number | NodeJS.Timeout | undefined

// request access to user's camera
const showCameraIntoVideo = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: VIDEO_FACE_MUSIC_DIMENSIONS },
        height: { ideal: VIDEO_FACE_MUSIC_DIMENSIONS },
        facingMode: 'user'
      },
      audio: false
    })
    .then((stream) => {
      streamRef = stream

      videoRef.value.srcObject = streamRef
      matchDimensions(canvasRef.value, {
        width: VIDEO_FACE_MUSIC_DIMENSIONS,
        height: VIDEO_FACE_MUSIC_DIMENSIONS
      })
    })
    .catch((error: Error) => {
      if (error.name === 'NotAllowedError') {
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

      const resizedDetection = resizeResults(detection, {
        width: VIDEO_FACE_MUSIC_DIMENSIONS,
        height: VIDEO_FACE_MUSIC_DIMENSIONS
      })

      canvasRef.value
        .getContext('2d')
        ?.clearRect(0, 0, VIDEO_FACE_MUSIC_DIMENSIONS, VIDEO_FACE_MUSIC_DIMENSIONS)
      if (resizedDetection) {
        draw.drawFaceExpressions(canvasRef.value, resizedDetection)
      }

      if (detection?.expressions) {
        if (detection.expressions.happy > 0.7 && isPaused.value) {
          playSong()
        } else if (detection.expressions.disgusted > 0.7 || detection.expressions.angry > 0.7) {
          controlSong(1)
        } else if (detection.expressions.surprised > 0.7 && audioVolume.value < MAX_VOLUME) {
          audioVolume.value = Number((Number(audioVolume.value) + VOLUME_STEPS).toPrecision(2))
        } else if (
          detection.expressions.sad > 0.7 ||
          (detection.expressions.fearful && !isPaused.value)
        ) {
          audioRef.value.pause()
          isPaused.value = true
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

// audio config
const audioRef = ref()
const currentIndex = ref(0)
const audioVolume = ref(1)
const isPaused = ref(true)
const audioCtx = new window.AudioContext()
const gainNode = audioCtx.createGain()

const controlSong = (value: number) => {
  const newIndex = currentIndex.value + value
  currentIndex.value =
    newIndex >= PLAY_LIST.length ? 0 : newIndex < 0 ? PLAY_LIST.length - 1 : newIndex

  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  isPaused.value = false
  setTimeout(() => audioRef.value.play(), 0)
}

const playSong = () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  if (audioRef.value.paused) {
    audioRef.value.play()
  } else {
    audioRef.value.pause()
  }
  isPaused.value = audioRef.value.paused
}

watch(audioVolume, () => {
  if (gainNode) {
    gainNode.gain.value = audioVolume.value
  }
})

onMounted(() => {
  document.title = 'Music Player | Face Detection'

  const track = audioCtx.createMediaElementSource(audioRef.value)
  // connect audio config
  track.connect(gainNode).connect(audioCtx.destination)
})

onUnmounted(() => {
  clearInterval(intervalRef)
  if (streamRef) {
    streamRef.getTracks().forEach((track: { stop: () => any }) => track.stop())
  }
})
</script>

<template>
  <main
    class="bg-stone-900 min-h-[100vh] flex items-center justify-center gap-6 md:gap-28 pt-20 md:pt-0 pb-4 relative before:absolute before:inset-0 before:bg-dark-transparent-20 before:pointer-events-none"
  >
    <section class="bg-white-transparent-50 max-w-[23rem] flex flex-col md:p-8 p-4 content-section">
      <h1 class="text-2xl text-stone-950 font-bold capitalize text-center mb-5">
        <strong class="bg-crimson">Face Expressions</strong> Player
      </h1>
      <p class="text-base text-stone-950 mb-5">
        Turn on your camera and interact with the music player using your face expressions. The
        available expressions/commands are:
      </p>
      <div class="flex gap-3 mb-4">
        <div
          class="flex flex-col items-center text-center"
          v-for="expression in EXPRESSIONS_COMMANDS"
          :key="expression.expression"
        >
          <div class="p-2 bg-white-transparent-60 rounded-lg">
            <img :src="expression.src" :alt="expression.alt" width="32" height="32" />
          </div>
          <strong class="text-sm text-white font-semibold">{{ expression.expression }}</strong>
          <span class="text-sm text-white">{{ expression.command }}</span>
        </div>
      </div>
      <div class="border-2 border-crimson mb-5 relative">
        <video
          ref="videoRef"
          :width="VIDEO_FACE_MUSIC_DIMENSIONS"
          :height="VIDEO_FACE_MUSIC_DIMENSIONS"
          @playing="startDetection"
          :poster="overlayImg"
          autoplay
          muted
        />
        <canvas ref="canvasRef" class="absolute inset-0" />
      </div>

      <h5 v-if="isLoadingModels" class="text-xl text-stone-950 font-medium">Loading model...</h5>
      <h5
        v-if="errorMessage"
        aria-live="polite"
        aria-atomic="true"
        class="text-xl text-stone-950 font-medium"
      >
        {{ errorMessage }}
      </h5>
    </section>

    <section class="relative w-[375px] max-w-full min-h-[730px]">
      <img
        :src="cellphone"
        alt="Cellphone"
        class="w-full absolute top-0 z-10 pointer-events-none"
      />

      <div class="flex flex-col bg-cod-gray absolute inset-6 px-12 pb-14">
        <audio ref="audioRef" :src="PLAY_LIST[currentIndex].src" crossorigin="anonymous"></audio>
        <div class="flex-1 flex flex-col justify-center">
          <div
            class="relative transition-all overflow-hidden song-image"
            :class="{ 'motion-safe:animate-spin rounded-full': !isPaused }"
          >
            <img
              class="w-full border-[5px] border-solid border-mine-shaft"
              :src="PLAY_LIST[currentIndex].cover"
              :alt="`Levitating by ${PLAY_LIST[currentIndex].artist}`"
            />
            <div
              :class="{ 'scale-100': !isPaused }"
              class="bg-dark-transparent-50 absolute scale-0 transition-transform h-8 w-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full before:w-5 before:h-5 before:bg-white-transparent-50 before:inline-block before:rounded-full after:rounded-full after:absolute after:w-3 after:h-3 after:bg-cod-gray"
            />
          </div>

          <h2 class="text-xl text-white font-medium mt-8">
            {{ PLAY_LIST[currentIndex].title }}
          </h2>
          <h3 class="text-base text-white font-semibold">
            {{ PLAY_LIST[currentIndex].artist }}
          </h3>
          <h5 class="text-base text-white font-normal">
            {{ PLAY_LIST[currentIndex].album }}
          </h5>
        </div>

        <div class="flex justify-center gap-9 mb-8">
          <button type="button" role="button" aria-label="Previous song" @click="controlSong(-1)">
            <Next class="text-white rotate-180 w-4 h-4 hover:text-crimson" />
          </button>

          <button
            type="button"
            role="button"
            aria-label="Play song"
            @click="playSong()"
            class="w-8 h-8 flex items-center justify-center bg-crimson transition-colors hover:bg-stone-500 rounded-full"
          >
            <Play v-if="isPaused" class="text-white w-6 h-6 pl-1" />
            <Pause v-else class="text-white w-4 h-4" />
          </button>

          <button type="button" role="button" aria-label="Next song" @click="controlSong(1)">
            <Next class="text-white w-4 h-4 hover:text-crimson" />
          </button>
        </div>
        <div class="flex gap-2 items-center justify-center">
          <Mute class="text-white w-4 h-4" />
          <InputRange v-model="audioVolume" />
          <Volume class="text-white w-4 h-4" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  background-image: url('/images/music-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.song-image {
  animation-duration: 3s;
}

.content-section {
  backdrop-filter: blur(10px);
}
</style>
