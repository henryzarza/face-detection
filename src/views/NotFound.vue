<script setup lang="ts">
import { RouterLink } from 'vue-router'
import emptySrc from '/images/not-found.svg'
</script>

<template>
  <main
    class="bg-stone-100 min-h-[100vh] flex flex-col items-center justify-center pt-20 md:pt-0 pb-4"
  >
    <img
      class="w-[35rem] max-w-full mb-5"
      :src="emptySrc"
      alt="Man with a green t-shirt opening a purple folder"
    />
    <h3 class="text-xl text-stone-950 max-w-[30rem] mb-4 text-center">
      Ohh, it seems you're lost. The page you're trying to get doesn't exist 🤔
    </h3>
    <RouterLink
      class="text-lg text-white bg-crimson border-2 border-solid border-crimson py-2 px-3 rounded-sm transition-colors hover:bg-white-transparent-50 hover:text-crimson font-semibold"
      to="/"
    >
      Take me Home
    </RouterLink>
  </main>
</template>
