<script setup lang="ts">
defineProps<{
  isEnabled: boolean;
}>();
</script>

<template>
  <span class="c-toggle u-transition flex h-6 w-11 items-center rounded-full p-1" :data-enabled="isEnabled">
    <span class="c-toggle-knob u-transition size-4 rounded-full bg-white shadow-sm" />
  </span>
</template>
