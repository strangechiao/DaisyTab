import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import type { AppSettings, ThemeMode } from "../types";

export function useSettings() {
  const openInNewWindow = ref(false);
  const isSearchHistoryEnabled = ref(true);
  const isBookmarkEnabled = ref(true);
  const themeMode = ref<ThemeMode>("system");
  const customBackground = ref("");
  const prefersDarkMode = ref(false);

  const searchTarget = computed(() => (openInNewWindow.value ? "_blank" : undefined));
  const isDarkMode = computed(() => themeMode.value === "dark" || (themeMode.value === "system" && prefersDarkMode.value));
  const hasCustomBackground = computed(() => Boolean(customBackground.value));

  function loadSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem("settings") ?? "{}") as Partial<AppSettings>;
      openInNewWindow.value = settings.openInNewWindow ?? openInNewWindow.value;
      isSearchHistoryEnabled.value = settings.isSearchHistoryEnabled ?? isSearchHistoryEnabled.value;
      isBookmarkEnabled.value = settings.isBookmarkEnabled ?? isBookmarkEnabled.value;
      themeMode.value = settings.themeMode ?? themeMode.value;
    } catch {
      // Keep defaults if the stored settings are malformed.
    }

    customBackground.value = localStorage.getItem("customBackground") ?? "";
  }

  function saveSettings() {
    const settings: AppSettings = {
      openInNewWindow: openInNewWindow.value,
      isSearchHistoryEnabled: isSearchHistoryEnabled.value,
      isBookmarkEnabled: isBookmarkEnabled.value,
      themeMode: themeMode.value,
    };

    localStorage.setItem("settings", JSON.stringify(settings));
  }

  function saveCustomBackground() {
    try {
      if (customBackground.value) {
        localStorage.setItem("customBackground", customBackground.value);
      } else {
        localStorage.removeItem("customBackground");
      }
    } catch {
      customBackground.value = "";
      localStorage.removeItem("customBackground");
    }
  }

  function clearCustomBackground() {
    customBackground.value = "";
  }

  function updateCustomBackground(value: string) {
    customBackground.value = value;
  }

  function setTheme(nextThemeMode: ThemeMode) {
    themeMode.value = nextThemeMode;
  }

  function toggleOpenInNewWindow() {
    openInNewWindow.value = !openInNewWindow.value;
  }

  function toggleSearchHistory() {
    isSearchHistoryEnabled.value = !isSearchHistoryEnabled.value;
  }

  function toggleBookmarks() {
    isBookmarkEnabled.value = !isBookmarkEnabled.value;
  }

  onMounted(() => {
    loadSettings();

    const darkModeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDarkMode.value = darkModeMedia.matches;

    const updateDarkMode = (event: MediaQueryListEvent) => {
      prefersDarkMode.value = event.matches;
    };

    darkModeMedia.addEventListener("change", updateDarkMode);

    onBeforeUnmount(() => {
      darkModeMedia.removeEventListener("change", updateDarkMode);
    });
  });

  watch([openInNewWindow, isSearchHistoryEnabled, isBookmarkEnabled, themeMode], saveSettings);
  watch(customBackground, saveCustomBackground);
  watchEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode.value);
  });
  watchEffect(() => {
    if (customBackground.value) {
      document.documentElement.style.setProperty("--custom-background", `url(${customBackground.value})`);
    } else {
      document.documentElement.style.removeProperty("--custom-background");
    }
  });

  return {
    clearCustomBackground,
    customBackground,
    hasCustomBackground,
    isBookmarkEnabled,
    isSearchHistoryEnabled,
    openInNewWindow,
    searchTarget,
    setTheme,
    themeMode,
    toggleBookmarks,
    toggleOpenInNewWindow,
    toggleSearchHistory,
    updateCustomBackground,
  };
}
