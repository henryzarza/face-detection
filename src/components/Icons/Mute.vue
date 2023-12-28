<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const props = defineProps<{ class: string | undefined }>()
</script>

<template>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="256.000000pt"
    height="256.000000pt"
    viewBox="0 0 256.000000 256.000000"
    preserveAspectRatio="xMidYMid meet"
    :class="props.class"
  >
    <g
      transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
      fill="currentColor"
      stroke="none"
    >
      <path
        d="M29 2531 c-20 -21 -29 -39 -29 -62 0 -30 29 -62 302 -336 l303 -303
-40 0 c-48 -1 -109 -21 -137 -47 -11 -10 -29 -35 -39 -56 -19 -35 -19 -60 -17
-461 l3 -423 29 -37 c53 -69 80 -76 341 -76 l230 0 420 -336 c231 -185 438
-350 459 -365 51 -38 89 -37 127 0 l29 29 0 176 c0 97 3 176 7 176 4 0 100
-92 213 -205 184 -183 210 -205 239 -205 45 0 91 46 91 92 0 30 -89 122 -1218
1250 -1128 1129 -1220 1218 -1250 1218 -24 0 -42 -9 -63 -29z"
      />
      <path
        d="M1848 2527 c-133 -102 -788 -630 -788 -635 0 -4 214 -221 475 -482
l475 -475 0 783 0 784 -29 29 c-40 39 -77 38 -133 -4z"
      />
    </g>
  </svg>
</template>
