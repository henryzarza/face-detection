<script setup lang="ts">
import { ref, onUnmounted, onMounted, watch } from 'vue'
import * as handTrack from 'handtrackjs'
import { PLAY_LIST, MAX_VOLUME, VOLUME_STEPS } from '@/constants'

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
handTrack
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
  })

// audio config
const audioRef = ref()
const currentIndex = ref(0)
const audioVolume = ref(1)
const audioCtx = new window.AudioContext()
const gainNode = audioCtx.createGain()

const controlSong = (value: number) => {
  const newIndex = currentIndex.value + value
  currentIndex.value =
    newIndex >= PLAY_LIST.length ? 0 : newIndex < 0 ? PLAY_LIST.length - 1 : newIndex

  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  audioRef.value.play()
}

watch(audioVolume, () => {
  gainNode.gain.value = audioVolume.value
})

onMounted(() => {
  const track = audioCtx.createMediaElementSource(audioRef.value)
  // connect audio config
  track.connect(gainNode).connect(audioCtx.destination)
})

onUnmounted(() => {
  handTrack.stopVideo(videoRef.value)
})
</script>

<template>
  <h1>Music Page</h1>
  <h6 v-if="isLoadingModels">Loading model...</h6>
  <h5 v-if="errorMessage" aria-live="polite" aria-atomic="true">{{ errorMessage }}</h5>

  <video ref="videoRef" width="300" height="300" autoplay muted />

  <canvas ref="canvasRef" width="300" height="300" />

  <audio ref="audioRef" :src="PLAY_LIST[currentIndex].src" crossorigin="anonymous"></audio>
  <img
    :src="PLAY_LIST[currentIndex].cover"
    :alt="`Levitating by ${PLAY_LIST[currentIndex].artist}`"
  />
  <div>
    <h2>{{ PLAY_LIST[currentIndex].title }}</h2>
    <h3>{{ PLAY_LIST[currentIndex].artist }}</h3>
    <h5>{{ PLAY_LIST[currentIndex].album }}</h5>
    <div>
      <button type="button" role="button" aria-label="Previous song" @click="controlSong(-1)">
        ⬅️
      </button>

      <button type="button" role="button" aria-label="Next song" @click="controlSong(1)">➡️</button>
    </div>
    <label for="volume">Vol 🔊</label>
    <input
      type="range"
      id="volume"
      min="0"
      :max="MAX_VOLUME"
      :step="VOLUME_STEPS"
      v-model="audioVolume"
    />
    <span>Min: 0</span> <br />
    <span>Value: {{ audioVolume }}</span> <br />
    <span>Max: {{ MAX_VOLUME }}</span>
  </div>
</template>

<style scoped>
canvas {
  border: 1px solid blue;
}

video {
  display: none;
}
</style>
