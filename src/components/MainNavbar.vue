<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ROUTES } from '../constants'

const router = useRouter()
const navTheme = ref()

router.beforeEach((entryRoute) => {
  switch (entryRoute.name) {
    case ROUTES[0].name:
      navTheme.value = 'gold'
      break
    case ROUTES[1].name:
      navTheme.value = 'crimson'
      break
    default:
      navTheme.value = 'vermilion'
      break
  }
})
</script>

<template>
  <nav
    :class="navTheme"
    class="h-20 absolute top-0 left-0 right-0 bg-dark-transparent-60 flex place-items-center justify-center md:gap-12 gap-4 flex-wrap z-10"
  >
    <RouterLink
      v-for="route in ROUTES"
      :key="route.name"
      :to="route.path"
      class="text-xl font-semibold underline transition hover:no-underline focus:no-underline"
      active-class="no-underline"
    >
      {{ route.text }}
    </RouterLink>
  </nav>
</template>

<style scoped>
nav {
  --primary-color: #ffbf00;
  --text-color: #ffbf00;
  --hover-color: #0c0a09;
}

nav a {
  color: var(--text-color);
}

nav a:is(:hover, :focus),
nav a[aria-current='page'] {
  background-color: var(--primary-color);
  color: var(--hover-color);
}

.gold {
  --primary-color: #ffbf00;
  --text-color: #ffbf00;
  --hover-color: #0c0a09;

  background-color: rgba(0, 0, 0, 0.65);
}

.crimson {
  --primary-color: #ec1850;
  --text-color: #0c0a09;
  --hover-color: #fff;

  background-color: rgba(255, 255, 255, 0.6);
}

.vermilion {
  --primary-color: #f64d07;
  --text-color: #f64d07;
  --hover-color: #fff;

  background-color: rgba(255, 255, 255, 0.6);
}
</style>
