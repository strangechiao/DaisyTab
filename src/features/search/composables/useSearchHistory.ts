import { onMounted, ref, type Ref } from "vue";

export function useSearchHistory(isSearchHistoryEnabled: Ref<boolean>) {
  const searchQuery = ref("");
  const searchHistory = ref<string[]>([]);

  function saveSearchHistory() {
    const trimmedQuery = searchQuery.value.trim();

    if (!trimmedQuery || !isSearchHistoryEnabled.value) {
      return;
    }

    searchHistory.value = [trimmedQuery, ...searchHistory.value.filter((item) => item !== trimmedQuery)].slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));
  }

  function selectHistoryItem(historyItem: string) {
    searchQuery.value = historyItem;
  }

  function removeHistoryItem(historyItem: string) {
    searchHistory.value = searchHistory.value.filter((item) => item !== historyItem);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));
  }

  onMounted(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem("searchHistory") ?? "[]");
      searchHistory.value = Array.isArray(storedHistory) ? storedHistory.filter((item) => typeof item === "string") : [];
    } catch {
      searchHistory.value = [];
    }
  });

  return {
    removeHistoryItem,
    saveSearchHistory,
    searchHistory,
    searchQuery,
    selectHistoryItem,
  };
}
