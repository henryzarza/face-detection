<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const props = defineProps<{ class: string | undefined }>()
</script>

<template>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="512.000000pt"
    height="512.000000pt"
    viewBox="0 0 512.000000 512.000000"
    preserveAspectRatio="xMidYMid meet"
    :class="props.class"
  >
    <g
      transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
      fill="currentColor"
      stroke="none"
    >
      <path
        d="M1076 5104 c-253 -57 -445 -229 -533 -479 l-28 -80 0 -1985 0 -1985
    28 -80 c111 -316 400 -513 723 -492 180 12 325 79 460 212 64 64 90 98 126
    172 90 179 83 -7 83 2173 0 2180 7 1994 -83 2173 -81 163 -239 296 -417 353
    -104 33 -259 41 -359 18z"
      />
      <path
        d="M3774 5110 c-143 -26 -265 -92 -380 -205 -64 -64 -89 -98 -126 -172
    -90 -179 -83 7 -83 -2173 0 -2180 -7 -1994 83 -2173 81 -163 237 -295 417
    -354 68 -22 98 -26 205 -27 141 -1 211 14 321 68 174 86 298 228 366 421 l28
    80 0 1985 0 1985 -28 80 c-84 236 -262 407 -492 470 -72 19 -240 27 -311 15z"
      />
    </g>
  </svg>
</template>
