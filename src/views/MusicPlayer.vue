<script setup lang="ts">
import { ref, onUnmounted, onMounted, watch } from 'vue'
import * as handTrack from 'handtrackjs'
import { PLAY_LIST, MAX_VOLUME, VOLUME_STEPS } from '@/constants'
import cellphone from '/images/cellphone.png'
// import overlayImg from '/images/overlay.png'
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
let model: {
  detect: (arg0: any) => Promise<any>
  renderPredictions: (arg0: any, arg1: any, arg2: any, arg3: any) => void
}

const runDetection = () => {
  model.detect(videoRef.value).then((predictions: any) => {
    if (Array.isArray(predictions)) {
      try {
        predictions.forEach((el) => {
          if (Number(el.score) >= 0.7) {
            switch (el.label) {
              case 'closed':
                audioRef.value.pause()
                throw new Error('break the loop')
              case 'pinch':
              case 'point':
                if (audioVolume.value < MAX_VOLUME)
                  audioVolume.value = Number(
                    (Number(audioVolume.value) + VOLUME_STEPS).toPrecision(2)
                  )
                throw new Error('break the loop')
              case 'open':
                if (audioCtx.state === 'suspended') {
                  audioCtx.resume()
                }
                audioRef.value.play()
                throw new Error('break the loop')
              default:
                break
            }
          }
        })
      } catch (error: Error | any) {
        if (error.message !== 'break the loop') {
          errorMessage.value = 'Error detecting'
        }
      }
    }

    // show the predictions in the canvas
    model.renderPredictions(
      predictions,
      canvasRef.value,
      canvasRef.value.getContext('2d'),
      videoRef.value
    )

    requestAnimationFrame(runDetection)
  })
}

// initialize hand track detection
/* handTrack
  .load({
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 2, // maximum number of boxes to detect
    iouThreshold: 0.6, // ioU threshold for non-max suppression
    modelSize: 'medium',
    scoreThreshold: 0.6 // confidence threshold for predictions
  })
  .then((entryModel: any) => {
    handTrack.startVideo(videoRef.value).then((status: any) => {
      if (status) {
        isLoadingModels.value = false
        model = entryModel
        // running the detection
        runDetection()
      } else errorMessage.value = 'Please enable video'
    })
  })
  .catch((error: Error) => {
    errorMessage.value = `There was an error loading the models: ${error.name}`
  }) */

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
  handTrack.stopVideo(videoRef.value)
})
</script>

<template>
  <main
    class="bg-stone-900 min-h-[100vh] flex items-center justify-center gap-6 md:gap-28 pt-20 md:pt-0 pb-4 relative before:absolute before:inset-0 before:bg-dark-transparent-20 before:pointer-events-none"
  >
    <section class="bg-white-transparent-50 max-w-[23rem] flex flex-col md:p-8 p-4 content-section">
      <h1 class="text-2xl text-stone-950 font-bold capitalize text-center mb-5">
        <strong class="bg-crimson">Handtrack</strong> Music Player
      </h1>
      <p class="text-base text-stone-950 mb-5">
        Turn on your camera and interact with the music player using your hand gestures. The
        available gestures are:
      </p>

      <video ref="videoRef" class="hidden" width="300" height="300" autoplay muted />
      <canvas ref="canvasRef" class="w-[300px] max-w-full h-[300px] mb-5 border-2 border-crimson" />

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
