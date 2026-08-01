<script setup lang="ts">
// 通用开关组件，父组件只传当前是否开启。
defineProps<{
  isEnabled: boolean;
}>();
</script>

<template>
  <!-- 开关轨道 -->
  <span
    class="c-toggle u-transition flex h-6 w-11 items-center rounded-full p-1"
    :data-enabled="isEnabled"
  >
    <!-- 开关圆点 -->
    <span class="c-toggle-knob u-transition size-4 rounded-full bg-white shadow-sm" />
  </span>
</template>
