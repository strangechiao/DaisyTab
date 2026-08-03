import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useBookmarks } from "../features/bookmarks/composables/useBookmarks";
import { useSearchEngines } from "../features/search/composables/useSearchEngines";
import { useSearchHistory } from "../features/search/composables/useSearchHistory";
import { useSettings } from "../features/settings/composables/useSettings";
import type { SearchEngine } from "../shared/types";

export function useNewTabPage() {
  const isEngineMenuOpen = ref(false);
  const isSettingsMenuOpen = ref(false);
  const isHistoryMenuOpen = ref(false);
  const isSearchFocused = ref(false);

  const settings = useSettings();
  const searchEngines = useSearchEngines();
  const searchHistory = useSearchHistory(settings.isSearchHistoryEnabled);
  const bookmarks = useBookmarks();

  const isSearchHistoryVisible = computed(
    () => settings.isSearchHistoryEnabled.value && isHistoryMenuOpen.value && !isEngineMenuOpen.value && !isSettingsMenuOpen.value,
  );

  function selectEngine(...args: Parameters<typeof searchEngines.selectEngine>) {
    searchEngines.selectEngine(...args);
    isEngineMenuOpen.value = false;
  }

  function toggleEngineMenu() {
    isEngineMenuOpen.value = !isEngineMenuOpen.value;
    isSettingsMenuOpen.value = false;
    isHistoryMenuOpen.value = false;
  }

  function toggleSettingsMenu() {
    isSettingsMenuOpen.value = !isSettingsMenuOpen.value;
    isEngineMenuOpen.value = false;
    isHistoryMenuOpen.value = false;
  }

  function openHistoryMenu() {
    isSearchFocused.value = true;
    isHistoryMenuOpen.value = settings.isSearchHistoryEnabled.value;
    isEngineMenuOpen.value = false;
    isSettingsMenuOpen.value = false;
  }

  function focusSearchInput() {
    isSearchFocused.value = true;
  }

  function clearSearch() {
    searchHistory.searchQuery.value = "";
  }

  function saveSearchHistory() {
    searchHistory.saveSearchHistory();
    isHistoryMenuOpen.value = false;
  }

  function submitSearch() {
    const query = searchHistory.searchQuery.value.trim();

    if (!query) {
      return;
    }

    searchHistory.saveSearchHistory();
    isHistoryMenuOpen.value = false;

    const searchUrl = buildSearchUrl(searchEngines.selectedEngine.value, query);

    if (settings.searchTarget.value === "_blank") {
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = searchUrl;
    }
  }

  function selectHistoryItem(historyItem: string) {
    searchHistory.selectHistoryItem(historyItem);
    isHistoryMenuOpen.value = false;
  }

  function clearCustomBackground() {
    settings.clearCustomBackground();
    isSettingsMenuOpen.value = false;
  }

  function updateCustomBackground(value: string) {
    settings.updateCustomBackground(value);
    isSettingsMenuOpen.value = false;
  }

  function toggleSearchHistory() {
    settings.toggleSearchHistory();

    if (!settings.isSearchHistoryEnabled.value) {
      isHistoryMenuOpen.value = false;
    }
  }

  function closeMenusOnOutsideClick(event: MouseEvent) {
    if (!(event.target as Element).closest("[data-search-area]")) {
      isEngineMenuOpen.value = false;
      isSettingsMenuOpen.value = false;
      isHistoryMenuOpen.value = false;
      isSearchFocused.value = false;
    }
  }

  onMounted(() => {
    document.addEventListener("click", closeMenusOnOutsideClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", closeMenusOnOutsideClick);
  });

  watch(settings.isSearchHistoryEnabled, (enabled) => {
    if (!enabled) {
      isHistoryMenuOpen.value = false;
    }
  });

  return {
    ...bookmarks,
    ...searchEngines,
    ...searchHistory,
    ...settings,
    clearCustomBackground,
    clearSearch,
    focusSearchInput,
    isAddingEngine: searchEngines.isAddingEngine,
    isEngineMenuOpen,
    isHistoryMenuOpen,
    isSearchFocused,
    isSearchHistoryVisible,
    isSettingsMenuOpen,
    openHistoryMenu,
    saveSearchHistory,
    selectEngine,
    selectHistoryItem,
    submitSearch,
    toggleEngineMenu,
    toggleSearchHistory,
    toggleSettingsMenu,
    updateCustomBackground,
  };
}

function buildSearchUrl(engine: SearchEngine, query: string) {
  if (engine.urlTemplate.includes("%s")) {
    return engine.urlTemplate.replace("%s", encodeURIComponent(query));
  }

  const searchUrl = new URL(engine.action);
  searchUrl.searchParams.set(engine.queryName, query);

  return searchUrl.href;
}
