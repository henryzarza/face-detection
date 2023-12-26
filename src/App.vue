<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainNavbar from './components/MainNavbar.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <MainNavbar />

  <main class="bg-stone-900 min-h-[100vh] relative">
    <RouterView />
  </main>

  <MainFooter />
</template>
