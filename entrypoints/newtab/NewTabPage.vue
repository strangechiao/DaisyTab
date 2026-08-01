<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import BookmarkGrid from "./components/BookmarkGrid.vue";
import BookmarkModal from "./components/BookmarkModal.vue";
import SearchBox from "./components/SearchBox.vue";
import { useBookmarks } from "./composables/useBookmarks";
import { useSearchEngines } from "./composables/useSearchEngines";
import { useSearchHistory } from "./composables/useSearchHistory";
import { useSettings } from "./composables/useSettings";

// 新标签页的页面级 UI 状态。
const isEngineMenuOpen = ref(false);
const isSettingsMenuOpen = ref(false);
const isHistoryMenuOpen = ref(false);
const isSearchFocused = ref(false);

// 主题、背景、设置项这些全局偏好。
const {
  clearCustomBackground: clearStoredCustomBackground,
  customBackground,
  hasCustomBackground,
  isBookmarkEnabled,
  isSearchHistoryEnabled,
  openInNewWindow,
  searchTarget,
  setTheme,
  themeMode,
  toggleBookmarks: toggleStoredBookmarks,
  toggleOpenInNewWindow,
  toggleSearchHistory: toggleStoredSearchHistory,
  updateCustomBackground: updateStoredCustomBackground,
} = useSettings();

// 搜索引擎列表、当前搜索引擎、添加/删除/拖动排序。
const {
  addEngineFromInput,
  draggedEngine,
  endEngineDrag,
  moveDraggedEngine,
  newEngineUrl,
  queryName,
  removeEngine,
  searchEngines,
  selectEngine: selectStoredEngine,
  selectedEngine,
  startEngineDrag,
} = useSearchEngines();

// 搜索输入内容和搜索记录。
const {
  removeHistoryItem,
  saveSearchHistory: saveStoredSearchHistory,
  searchHistory,
  searchQuery,
  selectHistoryItem: selectStoredHistoryItem,
} = useSearchHistory(isSearchHistoryEnabled);

// 书签列表、新增书签弹窗和编辑模式。
const {
  bookmarks,
  closeBookmarkModal,
  editingBookmark,
  isBookmarkModalOpen,
  newBookmarkName,
  newBookmarkUrl,
  openBookmark,
  openBookmarkEditor,
  openBookmarkModal,
  removeEditingBookmark,
  saveBookmark,
} = useBookmarks();

// 搜索记录只在输入框主动打开，并且其他菜单关闭时显示。
const isSearchHistoryVisible = computed(
  () => isSearchHistoryEnabled.value && isHistoryMenuOpen.value && !isEngineMenuOpen.value && !isSettingsMenuOpen.value,
);

// 选择搜索引擎后关闭搜索引擎菜单。
function selectEngine(...args: Parameters<typeof selectStoredEngine>) {
  selectStoredEngine(...args);
  isEngineMenuOpen.value = false;
}

// 打开搜索引擎菜单，同时关闭其他下拉菜单。
function toggleEngineMenu() {
  isEngineMenuOpen.value = !isEngineMenuOpen.value;
  isSettingsMenuOpen.value = false;
  isHistoryMenuOpen.value = false;
}

// 打开设置菜单，同时关闭其他下拉菜单。
function toggleSettingsMenu() {
  isSettingsMenuOpen.value = !isSettingsMenuOpen.value;
  isEngineMenuOpen.value = false;
  isHistoryMenuOpen.value = false;
}

// 鼠标点进输入框时才打开搜索记录菜单。
function openHistoryMenu() {
  isSearchFocused.value = true;
  isHistoryMenuOpen.value = isSearchHistoryEnabled.value;
  isEngineMenuOpen.value = false;
  isSettingsMenuOpen.value = false;
}

// 输入框获得焦点后给搜索栏加深边框。
function focusSearchInput() {
  isSearchFocused.value = true;
}

// 清空搜索内容并把光标放回输入框。
function clearSearch() {
  searchQuery.value = "";
}

// 提交搜索时保存搜索记录，并关闭历史菜单。
function saveSearchHistory() {
  saveStoredSearchHistory();
  isHistoryMenuOpen.value = false;
}

// 点击历史记录时回填搜索框。
function selectHistoryItem(historyItem: string) {
  selectStoredHistoryItem(historyItem);
  isHistoryMenuOpen.value = false;
}

// 清除自定义背景后关闭设置菜单。
function clearCustomBackground() {
  clearStoredCustomBackground();
  isSettingsMenuOpen.value = false;
}

// 上传自定义背景后关闭设置菜单。
function updateCustomBackground(value: string) {
  updateStoredCustomBackground(value);
  isSettingsMenuOpen.value = false;
}

// 切换搜索记录开关；关闭时同步收起历史菜单。
function toggleSearchHistory() {
  toggleStoredSearchHistory();

  if (!isSearchHistoryEnabled.value) {
    isHistoryMenuOpen.value = false;
  }
}

// 切换书签开关；关闭时同步退出编辑模式。
function toggleBookmarks() {
  toggleStoredBookmarks();
}

// 点击搜索栏外部时关闭菜单。
function closeMenusOnOutsideClick(event: MouseEvent) {
  if (!(event.target as Element).closest("[data-search-area]")) {
    isEngineMenuOpen.value = false;
    isSettingsMenuOpen.value = false;
    isHistoryMenuOpen.value = false;
    isSearchFocused.value = false;
  }
}

// 监听页面点击，用来处理点空白关闭菜单。
onMounted(() => {
  document.addEventListener("click", closeMenusOnOutsideClick);
});

// 页面卸载时移除全局点击监听。
onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenusOnOutsideClick);
});

// 搜索记录被禁用时，确保下拉菜单不会继续显示。
watch(isSearchHistoryEnabled, (enabled) => {
  if (!enabled) {
    isHistoryMenuOpen.value = false;
  }
});
</script>

<template>
  <!-- 新标签页整体背景和主题色容器 -->
  <main
    class="c-app-shell u-transition grid min-h-screen place-items-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    :data-has-background="hasCustomBackground"
  >
    <!-- 搜索区：标题、搜索框、下拉菜单和书签入口 -->
    <section class="grid w-full max-w-[600px] justify-items-center">
      <!-- 当前搜索引擎标题 -->
      <h1 class="u-transition mb-6 select-none text-4xl font-semibold text-slate-500 dark:text-slate-500">
        {{ selectedEngine.name }}
      </h1>

      <!-- 搜索表单主体 -->
      <SearchBox
        v-model:new-engine-url="newEngineUrl"
        v-model:search-query="searchQuery"
        :custom-background="customBackground"
        :dragged-engine="draggedEngine"
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
        @save-history="saveSearchHistory"
        @select-engine="selectEngine"
        @select-history="selectHistoryItem"
        @set-theme="setTheme"
        @toggle-bookmarks="toggleBookmarks"
        @toggle-engine-menu="toggleEngineMenu"
        @toggle-open-in-new-window="toggleOpenInNewWindow"
        @toggle-search-history="toggleSearchHistory"
        @toggle-settings-menu="toggleSettingsMenu"
      />

      <!-- 书签网格 -->
      <BookmarkGrid
        :bookmarks="bookmarks"
        :is-enabled="isBookmarkEnabled"
        @add="openBookmarkModal"
        @edit="openBookmarkEditor"
        @open="openBookmark"
      />
    </section>

    <!-- 新增书签弹窗 -->
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
