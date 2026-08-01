<script setup lang="ts">
import type { ThemeMode } from "../types";

// 主题切换按钮，负责自己的选中态样式。
const props = defineProps<{
  label: string;
  mode: ThemeMode;
  themeMode: ThemeMode;
}>();

const emit = defineEmits<{
  select: [mode: ThemeMode];
}>();
</script>

<template>
  <button
    class="c-theme-mode-button u-transition rounded-full px-2.5 py-1 text-xs"
    :data-active="props.themeMode === props.mode"
    type="button"
    @click="emit('select', props.mode)"
  >
    {{ label }}
  </button>
</template>
