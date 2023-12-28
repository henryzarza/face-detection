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
        d="M629 2177 c-78 -22 -145 -82 -171 -154 -10 -30 -13 -180 -13 -743 0
-656 1 -708 18 -752 20 -52 80 -112 136 -136 59 -25 147 -20 209 12 155 79
1211 681 1235 703 92 89 92 257 0 346 -24 22 -1087 628 -1230 701 -62 31 -126
39 -184 23z"
      />
    </g>
  </svg>
</template>
