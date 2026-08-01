<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import SearchEngineMenu from "./SearchEngineMenu.vue";
import SearchHistoryMenu from "./SearchHistoryMenu.vue";
import SettingsMenu from "./SettingsMenu.vue";
import type { SearchEngine, ThemeMode } from "../types";

const searchQuery = defineModel<string>("searchQuery", { required: true });
const newEngineUrl = defineModel<string>("newEngineUrl", { required: true });

defineProps<{
  customBackground: string;
  draggedEngine: SearchEngine | null;
  isBookmarkEnabled: boolean;
  isEngineMenuOpen: boolean;
  isSearchFocused: boolean;
  isSearchHistoryEnabled: boolean;
  isSearchHistoryVisible: boolean;
  isSettingsMenuOpen: boolean;
  openInNewWindow: boolean;
  queryName: string;
  searchEngines: SearchEngine[];
  searchHistory: string[];
  searchTarget?: string;
  selectedEngine: SearchEngine;
  themeMode: ThemeMode;
}>();

const emit = defineEmits<{
  addEngine: [];
  backgroundSelected: [value: string];
  clearBackground: [];
  clearSearch: [];
  closeBackground: [];
  dragEnd: [];
  dragMove: [engine: SearchEngine];
  dragStart: [engine: SearchEngine, event: DragEvent];
  focusSearch: [];
  openHistory: [];
  removeEngine: [engine: SearchEngine];
  removeHistory: [historyItem: string];
  saveHistory: [];
  selectEngine: [engine: SearchEngine];
  selectHistory: [historyItem: string];
  setTheme: [themeMode: ThemeMode];
  toggleBookmarks: [];
  toggleEngineMenu: [];
  toggleOpenInNewWindow: [];
  toggleSearchHistory: [];
  toggleSettingsMenu: [];
}>();

const searchInput = ref<HTMLInputElement | null>(null);

function clearSearch() {
  emit("clearSearch");
  searchInput.value?.focus();
}
</script>

<template>
  <!-- 搜索表单主体 -->
  <form
    class="c-search-form"
    :data-focused="isSearchFocused"
    :action="selectedEngine.action"
    method="get"
    :target="searchTarget"
    @submit="emit('saveHistory')"
  >
    <!-- 左侧搜索引擎按钮 -->
    <button class="c-icon-button group" type="button" :aria-label="`选择搜索引擎，当前为 ${selectedEngine.name}`" @click="emit('toggleEngineMenu')">
      <Icon class="c-icon-lg" :icon="selectedEngine.icon" />
    </button>

    <!-- 搜索关键词输入框 -->
    <input
      ref="searchInput"
      v-model="searchQuery"
      class="c-search-input"
      :name="queryName"
      autocomplete="off"
      autofocus
      @focus="emit('focusSearch')"
      @pointerdown="emit('openHistory')"
    />

    <!-- 清空输入按钮，仅在有内容时显示 -->
    <button v-if="searchQuery" class="c-icon-button group" type="button" aria-label="清空搜索内容" @click="clearSearch">
      <Icon class="c-icon" icon="ph:x" />
    </button>

    <!-- 提交搜索按钮 -->
    <button class="c-icon-button group" type="submit">
      <Icon class="c-icon" icon="ph:magnifying-glass" />
    </button>

    <!-- 设置按钮 -->
    <button class="c-icon-button group" type="button" aria-label="打开设置" @click="emit('toggleSettingsMenu')">
      <Icon class="c-icon" icon="ph:gear-six" />
    </button>

    <!-- 搜索引擎下拉菜单 -->
    <SearchEngineMenu
      v-model:new-engine-url="newEngineUrl"
      :dragged-engine="draggedEngine"
      :is-open="isEngineMenuOpen"
      :search-engines="searchEngines"
      @add="emit('addEngine')"
      @drag-end="emit('dragEnd')"
      @drag-move="emit('dragMove', $event)"
      @drag-start="(...args) => emit('dragStart', ...args)"
      @remove="emit('removeEngine', $event)"
      @select="emit('selectEngine', $event)"
    />

    <!-- 搜索历史下拉菜单 -->
    <SearchHistoryMenu
      :history="searchHistory"
      :is-open="isSearchHistoryVisible"
      @remove="emit('removeHistory', $event)"
      @select="emit('selectHistory', $event)"
    />

    <!-- 设置下拉菜单 -->
    <SettingsMenu
      :custom-background="customBackground"
      :is-bookmark-enabled="isBookmarkEnabled"
      :is-open="isSettingsMenuOpen"
      :is-search-history-enabled="isSearchHistoryEnabled"
      :open-in-new-window="openInNewWindow"
      :theme-mode="themeMode"
      @background-selected="emit('backgroundSelected', $event)"
      @clear-background="emit('clearBackground')"
      @set-theme="emit('setTheme', $event)"
      @toggle-bookmarks="emit('toggleBookmarks')"
      @toggle-open-in-new-window="emit('toggleOpenInNewWindow')"
      @toggle-search-history="emit('toggleSearchHistory')"
    />
  </form>
</template>
