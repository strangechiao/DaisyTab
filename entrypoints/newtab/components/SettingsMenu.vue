<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import ThemeModeButton from "./ThemeModeButton.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import type { ThemeMode } from "../types";

// 设置菜单需要显示的当前设置状态。
defineProps<{
  customBackground: string;
  isBookmarkEnabled: boolean;
  isOpen: boolean;
  isSearchHistoryEnabled: boolean;
  openInNewWindow: boolean;
  themeMode: ThemeMode;
}>();

// 通知父组件修改设置或上传背景。
const emit = defineEmits<{
  backgroundSelected: [value: string];
  clearBackground: [];
  setTheme: [themeMode: ThemeMode];
  toggleBookmarks: [];
  toggleOpenInNewWindow: [];
  toggleSearchHistory: [];
}>();

// 隐藏的原生文件选择框，用来上传自定义背景。
const backgroundInput = ref<HTMLInputElement | null>(null);

// 点击上传按钮时打开系统文件选择窗口。
function chooseCustomBackground() {
  backgroundInput.value?.click();
}

// 读取用户选择的图片，并把结果交给父组件保存。
function updateCustomBackground(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    emit("backgroundSelected", typeof reader.result === "string" ? reader.result : "");
    input.value = "";
  });

  reader.readAsDataURL(file);
}
</script>

<template>
  <!-- 设置下拉菜单过渡动画 -->
  <Transition
    enter-active-class="u-transition"
    enter-from-class="-translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="u-transition"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-1 opacity-0"
  >
    <!-- 设置菜单面板 -->
    <div
      v-if="isOpen"
      class="absolute left-0 top-full z-10 mt-3 grid w-full gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgb(15_23_42_/_12%)] dark:border-slate-700 dark:bg-slate-900"
    >
      <!-- 新窗口打开开关 -->
      <button
        class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        type="button"
        @click="emit('toggleOpenInNewWindow')"
      >
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:arrow-square-out" />
        </span>
        <span class="min-w-0 flex-1 font-medium">新窗口打开</span>
        <ToggleSwitch :is-enabled="openInNewWindow" />
      </button>

      <!-- 搜索记录开关 -->
      <button
        class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        type="button"
        @click="emit('toggleSearchHistory')"
      >
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:clock-counter-clockwise" />
        </span>
        <span class="min-w-0 flex-1 font-medium">搜索记录</span>
        <ToggleSwitch :is-enabled="isSearchHistoryEnabled" />
      </button>

      <!-- 书签开关 -->
      <button
        class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        type="button"
        @click="emit('toggleBookmarks')"
      >
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:bookmarks-simple" />
        </span>
        <span class="min-w-0 flex-1 font-medium">书签</span>
        <ToggleSwitch :is-enabled="isBookmarkEnabled" />
      </button>

      <!-- 自定义背景上传和清除 -->
      <div class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:image" />
        </span>
        <span class="min-w-0 flex-1 font-medium">自定义背景</span>
        <input ref="backgroundInput" class="hidden" accept="image/*" type="file" @change="updateCustomBackground" />
        <button
          v-if="customBackground"
          class="u-transition rounded-full px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          type="button"
          @click="emit('clearBackground')"
        >
          清除
        </button>
        <button
          class="u-transition rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          type="button"
          @click="chooseCustomBackground"
        >
          上传
        </button>
      </div>

      <!-- 主题配色选择 -->
      <div class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:palette" />
        </span>
        <span class="min-w-0 flex-1 font-medium">主题配色（测试）</span>
        <span class="flex shrink-0 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <ThemeModeButton label="浅色" mode="light" :theme-mode="themeMode" @select="emit('setTheme', $event)" />
          <ThemeModeButton label="深色" mode="dark" :theme-mode="themeMode" @select="emit('setTheme', $event)" />
          <ThemeModeButton label="跟随系统" mode="system" :theme-mode="themeMode" @select="emit('setTheme', $event)" />
        </span>
      </div>
    </div>
  </Transition>
</template>
