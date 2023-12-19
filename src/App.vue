<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/try-on">Try On</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>
