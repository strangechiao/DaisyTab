<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import SearchEngineMenu from "./SearchEngineMenu.vue";
import SearchHistoryMenu from "./SearchHistoryMenu.vue";
import SettingsMenu from "../../settings/components/SettingsMenu.vue";
import type { SearchEngine, ThemeMode } from "../../../shared/types";

const searchQuery = defineModel<string>("searchQuery", { required: true });
const newEngineUrl = defineModel<string>("newEngineUrl", { required: true });

defineProps<{
  customBackground: string;
  draggedEngine: SearchEngine | null;
  isAddingEngine: boolean;
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
  dragEnd: [];
  dragMove: [engine: SearchEngine];
  dragStart: [engine: SearchEngine, event: DragEvent];
  focusSearch: [];
  openHistory: [];
  removeEngine: [engine: SearchEngine];
  removeHistory: [historyItem: string];
  selectEngine: [engine: SearchEngine];
  selectHistory: [historyItem: string];
  setTheme: [themeMode: ThemeMode];
  submitSearch: [];
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
  <form
    class="c-search-form"
    :data-focused="isSearchFocused"
    @submit.prevent="emit('submitSearch')"
  >
    <button class="c-icon-button group" type="button" :aria-label="`选择搜索引擎，当前为 ${selectedEngine.name}`" @click="emit('toggleEngineMenu')">
      <Icon class="c-icon-lg" :icon="selectedEngine.icon" />
    </button>

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

    <button v-if="searchQuery" class="c-icon-button group" type="button" aria-label="清空搜索内容" @click="clearSearch">
      <Icon class="c-icon" icon="ph:x" />
    </button>

    <button class="c-icon-button group" type="submit">
      <Icon class="c-icon" icon="ph:magnifying-glass" />
    </button>

    <button class="c-icon-button group" type="button" aria-label="打开设置" @click="emit('toggleSettingsMenu')">
      <Icon class="c-icon" icon="ph:gear-six" />
    </button>

    <SearchEngineMenu
      v-model:new-engine-url="newEngineUrl"
      :dragged-engine="draggedEngine"
      :is-adding-engine="isAddingEngine"
      :is-open="isEngineMenuOpen"
      :search-engines="searchEngines"
      @add="emit('addEngine')"
      @drag-end="emit('dragEnd')"
      @drag-move="emit('dragMove', $event)"
      @drag-start="(...args) => emit('dragStart', ...args)"
      @remove="emit('removeEngine', $event)"
      @select="emit('selectEngine', $event)"
    />

    <SearchHistoryMenu
      :history="searchHistory"
      :is-open="isSearchHistoryVisible"
      @remove="emit('removeHistory', $event)"
      @select="emit('selectHistory', $event)"
    />

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
