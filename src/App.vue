<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/music">Music</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>
