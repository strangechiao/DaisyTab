<script setup lang="ts">
import BookmarkGrid from "../features/bookmarks/components/BookmarkGrid.vue";
import BookmarkModal from "../features/bookmarks/components/BookmarkModal.vue";
import SearchBox from "../features/search/components/SearchBox.vue";
import { useNewTabPage } from "./useNewTabPage";

const {
  addEngineFromInput,
  bookmarks,
  clearCustomBackground,
  clearSearch,
  closeBookmarkModal,
  customBackground,
  draggedEngine,
  editingBookmark,
  endEngineDrag,
  focusSearchInput,
  hasCustomBackground,
  isAddingEngine,
  isBookmarkEnabled,
  isBookmarkModalOpen,
  isEngineMenuOpen,
  isSearchFocused,
  isSearchHistoryEnabled,
  isSearchHistoryVisible,
  isSettingsMenuOpen,
  moveDraggedEngine,
  newBookmarkName,
  newBookmarkUrl,
  newEngineUrl,
  openBookmark,
  openBookmarkEditor,
  openBookmarkModal,
  openHistoryMenu,
  openInNewWindow,
  queryName,
  removeEditingBookmark,
  removeEngine,
  removeHistoryItem,
  saveBookmark,
  saveSearchHistory,
  searchEngines,
  searchHistory,
  searchQuery,
  searchTarget,
  selectEngine,
  selectHistoryItem,
  selectedEngine,
  setTheme,
  startEngineDrag,
  submitSearch,
  themeMode,
  toggleBookmarks,
  toggleEngineMenu,
  toggleOpenInNewWindow,
  toggleSearchHistory,
  toggleSettingsMenu,
  updateCustomBackground,
} = useNewTabPage();
</script>

<template>
  <main
    class="c-app-shell u-transition grid min-h-screen place-items-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    :data-has-background="hasCustomBackground"
  >
    <section class="grid w-full max-w-[600px] justify-items-center">
      <h1 class="u-transition mb-6 select-none text-4xl font-semibold text-slate-500 dark:text-slate-500">
        {{ selectedEngine.name }}
      </h1>

      <SearchBox
        v-model:new-engine-url="newEngineUrl"
        v-model:search-query="searchQuery"
        :custom-background="customBackground"
        :dragged-engine="draggedEngine"
        :is-adding-engine="isAddingEngine"
        :is-bookmark-enabled="isBookmarkEnabled"
        :is-engine-menu-open="isEngineMenuOpen"
        :is-search-focused="isSearchFocused"
        :is-search-history-enabled="isSearchHistoryEnabled"
        :is-search-history-visible="isSearchHistoryVisible"
        :is-settings-menu-open="isSettingsMenuOpen"
        :open-in-new-window="openInNewWindow"
        :query-name="queryName"
        :search-engines="searchEngines"
        :search-history="searchHistory"
        :search-target="searchTarget"
        :selected-engine="selectedEngine"
        :theme-mode="themeMode"
        data-search-area
        @add-engine="addEngineFromInput"
        @background-selected="updateCustomBackground"
        @clear-background="clearCustomBackground"
        @clear-search="clearSearch"
        @drag-end="endEngineDrag"
        @drag-move="moveDraggedEngine"
        @drag-start="startEngineDrag"
        @focus-search="focusSearchInput"
        @open-history="openHistoryMenu"
        @remove-engine="removeEngine"
        @remove-history="removeHistoryItem"
        @submit-search="submitSearch"
        @select-engine="selectEngine"
        @select-history="selectHistoryItem"
        @set-theme="setTheme"
        @toggle-bookmarks="toggleBookmarks"
        @toggle-engine-menu="toggleEngineMenu"
        @toggle-open-in-new-window="toggleOpenInNewWindow"
        @toggle-search-history="toggleSearchHistory"
        @toggle-settings-menu="toggleSettingsMenu"
      />

      <BookmarkGrid
        :bookmarks="bookmarks"
        :is-enabled="isBookmarkEnabled"
        @add="openBookmarkModal"
        @edit="openBookmarkEditor"
        @open="openBookmark"
      />
    </section>

    <BookmarkModal
      v-model:name="newBookmarkName"
      v-model:url="newBookmarkUrl"
      :is-editing="Boolean(editingBookmark)"
      :is-open="isBookmarkModalOpen"
      @close="closeBookmarkModal"
      @delete="removeEditingBookmark"
      @submit="saveBookmark"
    />
  </main>
</template>
