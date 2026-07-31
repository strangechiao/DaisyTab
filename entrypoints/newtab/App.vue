<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { browser } from "wxt/browser";

type SearchEngine = {
  name: string;
  icon: string;
  action: string;
  displayUrl: string;
  queryName: string;
};

type ThemeMode = "light" | "dark" | "system";

type AppSettings = {
  openInNewWindow: boolean;
  isSearchHistoryEnabled: boolean;
  themeMode: ThemeMode;
};

type StoredState = {
  settings?: Partial<AppSettings>;
  searchHistory?: string[];
  searchEngines?: SearchEngine[];
  selectedEngineDisplayUrl?: string;
  customBackground?: string;
};

const defaultSearchEngines: SearchEngine[] = [
  {
    name: "Google",
    icon: "fe:google",
    action: "https://www.google.com/search",
    displayUrl: "google.com",
    queryName: "q",
  },
  {
    name: "Bing",
    icon: "simple-icons:microsoftbing",
    action: "https://www.bing.com/search",
    displayUrl: "bing.com",
    queryName: "q",
  },
  {
    name: "Baidu",
    icon: "simple-icons:baidu",
    action: "https://www.baidu.com/s",
    displayUrl: "baidu.com",
    queryName: "wd",
  },
  {
    name: "DuckDuckGo",
    icon: "simple-icons:duckduckgo",
    action: "https://duckduckgo.com/",
    displayUrl: "duckduckgo.com",
    queryName: "q",
  },
  {
    name: "Brave",
    icon: "simple-icons:brave",
    action: "https://search.brave.com/search",
    displayUrl: "search.brave.com",
    queryName: "q",
  },
  {
    name: "Yahoo",
    icon: "simple-icons:yahoo",
    action: "https://search.yahoo.com/search",
    displayUrl: "search.yahoo.com",
    queryName: "p",
  },
  {
    name: "Yandex",
    icon: "simple-icons:yandexcloud",
    action: "https://yandex.com/search/",
    displayUrl: "yandex.com",
    queryName: "text",
  },
  {
    name: "GitHub",
    icon: "simple-icons:github",
    action: "https://github.com/search",
    displayUrl: "github.com",
    queryName: "q",
  },
  {
    name: "MDN",
    icon: "simple-icons:mdnwebdocs",
    action: "https://developer.mozilla.org/search",
    displayUrl: "developer.mozilla.org",
    queryName: "q",
  },
];

const searchEngines = ref<SearchEngine[]>([...defaultSearchEngines]);
const selectedEngine = ref<SearchEngine>(searchEngines.value[0]);
const isEngineMenuOpen = ref(false);
const isSettingsMenuOpen = ref(false);
const isHistoryMenuOpen = ref(false);
const isSearchFocused = ref(false);
const searchQuery = ref("");
const searchHistory = ref<string[]>([]);
const newEngineUrl = ref("");
const draggedEngine = ref<SearchEngine | null>(null);
const searchForm = ref<HTMLFormElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const backgroundInput = ref<HTMLInputElement | null>(null);
const openInNewWindow = ref(false);
const isSearchHistoryEnabled = ref(true);
const themeMode = ref<ThemeMode>("system");
const customBackground = ref("");
const prefersDarkMode = ref(false);
const isStorageReady = ref(false);
const queryName = computed(() => selectedEngine.value.queryName);
const searchTarget = computed(() => (openInNewWindow.value ? "_blank" : undefined));
const isDarkMode = computed(() => themeMode.value === "dark" || (themeMode.value === "system" && prefersDarkMode.value));
const backgroundStyle = computed(() =>
  customBackground.value
    ? {
        backgroundImage: `linear-gradient(rgb(15 23 42 / 18%), rgb(15 23 42 / 18%)), url(${customBackground.value})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : undefined,
);
const isSearchHistoryVisible = computed(
  () =>
    isSearchHistoryEnabled.value && isHistoryMenuOpen.value && !isEngineMenuOpen.value && !isSettingsMenuOpen.value,
);

const enginePresets: Record<string, Omit<SearchEngine, "displayUrl">> = {
  "google.com": {
    name: "Google",
    icon: "fe:google",
    action: "https://www.google.com/search",
    queryName: "q",
  },
  "bing.com": {
    name: "Bing",
    icon: "simple-icons:microsoftbing",
    action: "https://www.bing.com/search",
    queryName: "q",
  },
  "baidu.com": {
    name: "Baidu",
    icon: "simple-icons:baidu",
    action: "https://www.baidu.com/s",
    queryName: "wd",
  },
  "duckduckgo.com": {
    name: "DuckDuckGo",
    icon: "simple-icons:duckduckgo",
    action: "https://duckduckgo.com/",
    queryName: "q",
  },
  "search.brave.com": {
    name: "Brave",
    icon: "simple-icons:brave",
    action: "https://search.brave.com/search",
    queryName: "q",
  },
  "search.yahoo.com": {
    name: "Yahoo",
    icon: "simple-icons:yahoo",
    action: "https://search.yahoo.com/search",
    queryName: "p",
  },
  "yandex.com": {
    name: "Yandex",
    icon: "simple-icons:yandexcloud",
    action: "https://yandex.com/search/",
    queryName: "text",
  },
  "github.com": {
    name: "GitHub",
    icon: "simple-icons:github",
    action: "https://github.com/search",
    queryName: "q",
  },
  "developer.mozilla.org": {
    name: "MDN",
    icon: "simple-icons:mdnwebdocs",
    action: "https://developer.mozilla.org/search",
    queryName: "q",
  },
};

function isValidSearchEngine(value: unknown): value is SearchEngine {
  if (!value || typeof value !== "object") {
    return false;
  }

  const engine = value as SearchEngine;

  return (
    typeof engine.name === "string" &&
    typeof engine.icon === "string" &&
    typeof engine.action === "string" &&
    typeof engine.displayUrl === "string" &&
    typeof engine.queryName === "string"
  );
}

function getStoredState(): Promise<StoredState> {
  return browser.storage.local.get(["settings", "searchHistory", "searchEngines", "selectedEngineDisplayUrl", "customBackground"]) as Promise<StoredState>;
}

function setStoredState(state: StoredState) {
  return browser.storage.local.set(state);
}

async function loadStoredState() {
  let migratedSettings: Partial<AppSettings> = {};
  let migratedSearchHistory: string[] = [];
  let migratedCustomBackground = "";

  try {
    migratedSettings = JSON.parse(localStorage.getItem("settings") ?? "{}") as Partial<AppSettings>;
  } catch {
    migratedSettings = {};
  }

  try {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory") ?? "[]");
    migratedSearchHistory = Array.isArray(storedHistory) ? storedHistory.filter((item) => typeof item === "string") : [];
  } catch {
    migratedSearchHistory = [];
  }

  migratedCustomBackground = localStorage.getItem("customBackground") ?? "";

  try {
    const storedState = await getStoredState();
    const settings = storedState.settings ?? migratedSettings;
    const storedSearchHistory = storedState.searchHistory ?? migratedSearchHistory;
    const storedSearchEngines = storedState.searchEngines?.filter(isValidSearchEngine);

    openInNewWindow.value = settings.openInNewWindow ?? openInNewWindow.value;
    isSearchHistoryEnabled.value = settings.isSearchHistoryEnabled ?? isSearchHistoryEnabled.value;
    themeMode.value = settings.themeMode ?? themeMode.value;
    customBackground.value = storedState.customBackground ?? migratedCustomBackground;
    searchHistory.value = Array.isArray(storedSearchHistory) ? storedSearchHistory.filter((item) => typeof item === "string") : [];

    if (storedSearchEngines?.length) {
      searchEngines.value = storedSearchEngines;
    }

    selectedEngine.value =
      searchEngines.value.find((engine) => engine.displayUrl === storedState.selectedEngineDisplayUrl) ?? searchEngines.value[0];
  } finally {
    isStorageReady.value = true;
  }
}

function saveSettings() {
  if (!isStorageReady.value) {
    return;
  }

  void setStoredState({
    settings: {
      openInNewWindow: openInNewWindow.value,
      isSearchHistoryEnabled: isSearchHistoryEnabled.value,
      themeMode: themeMode.value,
    },
  });
}

function saveSearchEngines() {
  if (!isStorageReady.value) {
    return;
  }

  void setStoredState({
    searchEngines: searchEngines.value,
    selectedEngineDisplayUrl: selectedEngine.value.displayUrl,
  });
}

function saveCustomBackground() {
  if (!isStorageReady.value) {
    return;
  }

  void setStoredState({ customBackground: customBackground.value }).catch(() => {
    customBackground.value = "";
  });
}

function selectEngine(engine: SearchEngine) {
  selectedEngine.value = engine;
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
  isHistoryMenuOpen.value = isSearchHistoryEnabled.value;
  isEngineMenuOpen.value = false;
  isSettingsMenuOpen.value = false;
}

function focusSearchInput() {
  isSearchFocused.value = true;
}

function clearSearchQuery() {
  searchQuery.value = "";
  searchInput.value?.focus();
}

function getDisplayUrl(value: string) {
  const normalizedUrl = value.includes("://") ? value : `https://${value}`;
  return new URL(normalizedUrl).hostname.replace(/^www\./, "");
}

function getEngineName(displayUrl: string) {
  return (
    displayUrl
      .split(".")
      .filter(Boolean)
      .at(0)
      ?.replace(/^\w/, (letter) => letter.toUpperCase()) ?? displayUrl
  );
}

function addEngineFromInput() {
  const trimmedUrl = newEngineUrl.value.trim();

  if (!trimmedUrl) {
    return;
  }

  try {
    const displayUrl = getDisplayUrl(trimmedUrl);
    const preset = enginePresets[displayUrl] ?? enginePresets[`www.${displayUrl}`];
    const engine: SearchEngine = preset
      ? { ...preset, displayUrl }
      : {
          name: getEngineName(displayUrl),
          icon: "ph:globe",
          action: `https://${displayUrl}/search`,
          displayUrl,
          queryName: "q",
        };

    searchEngines.value = [engine, ...searchEngines.value.filter((item) => item.displayUrl !== engine.displayUrl)];
    selectedEngine.value = engine;
    newEngineUrl.value = "";
  } catch {
    newEngineUrl.value = "";
  }
}

function removeEngine(engine: SearchEngine) {
  if (searchEngines.value.length <= 1) {
    return;
  }

  searchEngines.value = searchEngines.value.filter((item) => item !== engine);

  if (selectedEngine.value === engine) {
    selectedEngine.value = searchEngines.value[0];
  }
}

function startEngineDrag(engine: SearchEngine, event: DragEvent) {
  draggedEngine.value = engine;
  event.dataTransfer?.setData("text/plain", engine.displayUrl);

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
}

function moveDraggedEngine(targetEngine: SearchEngine) {
  const sourceEngine = draggedEngine.value;

  if (!sourceEngine || sourceEngine === targetEngine) {
    return;
  }

  const nextEngines = [...searchEngines.value];
  const sourceIndex = nextEngines.indexOf(sourceEngine);
  const targetIndex = nextEngines.indexOf(targetEngine);

  if (sourceIndex === -1 || targetIndex === -1) {
    return;
  }

  nextEngines.splice(sourceIndex, 1);
  nextEngines.splice(targetIndex, 0, sourceEngine);
  searchEngines.value = nextEngines;
}

function endEngineDrag() {
  draggedEngine.value = null;
}

function saveSearchHistory() {
  const trimmedQuery = searchQuery.value.trim();

  if (!trimmedQuery || !isSearchHistoryEnabled.value) {
    isHistoryMenuOpen.value = false;
    return;
  }

  searchHistory.value = [trimmedQuery, ...searchHistory.value.filter((item) => item !== trimmedQuery)].slice(0, 10);
  void setStoredState({ searchHistory: searchHistory.value });
  isHistoryMenuOpen.value = false;
}

function selectHistoryItem(historyItem: string) {
  searchQuery.value = historyItem;
  isHistoryMenuOpen.value = false;
}

function removeHistoryItem(historyItem: string) {
  searchHistory.value = searchHistory.value.filter((item) => item !== historyItem);
  void setStoredState({ searchHistory: searchHistory.value });
}

function chooseCustomBackground() {
  backgroundInput.value?.click();
}

function updateCustomBackground(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    customBackground.value = typeof reader.result === "string" ? reader.result : "";
    isSettingsMenuOpen.value = false;
    input.value = "";
  });

  reader.readAsDataURL(file);
}

function clearCustomBackground() {
  customBackground.value = "";
  isSettingsMenuOpen.value = false;
}

function toggleSearchHistory() {
  isSearchHistoryEnabled.value = !isSearchHistoryEnabled.value;

  if (!isSearchHistoryEnabled.value) {
    isHistoryMenuOpen.value = false;
  }
}

function closeMenusOnOutsideClick(event: MouseEvent) {
  if (!searchForm.value?.contains(event.target as Node)) {
    isEngineMenuOpen.value = false;
    isSettingsMenuOpen.value = false;
    isHistoryMenuOpen.value = false;
    isSearchFocused.value = false;
  }
}

onMounted(() => {
  void loadStoredState();
  const darkModeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  prefersDarkMode.value = darkModeMedia.matches;

  const updateDarkMode = (event: MediaQueryListEvent) => {
    prefersDarkMode.value = event.matches;
  };

  darkModeMedia.addEventListener("change", updateDarkMode);
  document.addEventListener("click", closeMenusOnOutsideClick);

  onBeforeUnmount(() => {
    darkModeMedia.removeEventListener("change", updateDarkMode);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenusOnOutsideClick);
});

watch([openInNewWindow, isSearchHistoryEnabled, themeMode], saveSettings);
watch(searchEngines, saveSearchEngines, { deep: true });
watch(selectedEngine, saveSearchEngines);
watch(customBackground, saveCustomBackground);
</script>

<template>
  <main
    class="u-transition min-h-screen content-center"
    :class="isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f4f6f8] text-slate-900'"
    :style="backgroundStyle"
  >
    <section class="relative justify-items-center">
      <h1
        class="u-transition absolute bottom-full mb-6 text-4xl font-semibold"
        :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"
      >
        {{ selectedEngine.name }}
      </h1>
      <form
        ref="searchForm"
        class="u-transition relative flex w-full max-w-[600px] items-center gap-3 rounded-full border-2 px-2 py-2"
        :class="[isSearchFocused ? 'border-slate-500' : 'border-slate-300', isDarkMode ? 'bg-slate-900' : 'bg-white']"
        :action="selectedEngine.action"
        method="get"
        :target="searchTarget"
        @submit="saveSearchHistory"
      >
        <button
          class="u-transition group grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
          type="button"
          :aria-label="`选择搜索引擎，当前为 ${selectedEngine.name}`"
          @click="toggleEngineMenu"
        >
          <Icon class="u-transition size-6 text-slate-400 group-hover:text-slate-600" :icon="selectedEngine.icon" />
        </button>
        <input
          ref="searchInput"
          v-model="searchQuery"
          class="min-w-0 flex-1 border-0 bg-transparent text-base outline-0"
          :class="isDarkMode ? 'text-slate-100' : 'text-gray-950'"
          :name="queryName"
          autocomplete="off"
          autofocus
          @focus="focusSearchInput"
          @pointerdown="openHistoryMenu"
        />
        <button
          v-if="searchQuery"
          class="u-transition group grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
          type="button"
          aria-label="清空搜索内容"
          @click="clearSearchQuery"
        >
          <Icon class="u-transition size-5 group-hover:text-slate-600" icon="ph:x" />
        </button>
        <button
          class="u-transition group grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
          type="submit"
        >
          <Icon class="u-transition size-5 group-hover:text-slate-600" icon="ph:magnifying-glass" />
        </button>
        <button
          class="u-transition group grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
          type="button"
          aria-label="打开设置"
          @click="toggleSettingsMenu"
        >
          <Icon class="u-transition size-5 group-hover:text-slate-600" icon="ph:gear-six" />
        </button>

        <Transition
          enter-active-class="u-transition"
          enter-from-class="-translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="u-transition"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-1 opacity-0"
        >
          <div
            v-if="isEngineMenuOpen"
            class="absolute left-0 top-full z-10 mt-3 grid w-full gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgb(15_23_42_/_12%)]"
          >
            <div class="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-slate-600">
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                <Icon class="size-6 text-slate-400" icon="ph:plus" />
              </span>
              <input
                v-model="newEngineUrl"
                class="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-0 placeholder:text-slate-400"
                placeholder="输入搜索引擎地址后回车"
                type="url"
                @keydown.enter.prevent="addEngineFromInput"
              />
            </div>

            <div
              v-for="engine in searchEngines"
              :key="engine.name"
              class="u-transition group flex cursor-grab items-center gap-3 rounded-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:cursor-grabbing"
              :class="draggedEngine === engine ? 'opacity-45' : 'opacity-100'"
              draggable="true"
              @dragend="endEngineDrag"
              @dragenter.prevent="moveDraggedEngine(engine)"
              @dragover.prevent
              @dragstart="startEngineDrag(engine, $event)"
            >
              <button class="flex min-w-0 flex-1 items-center gap-3 text-left" type="button" @click="selectEngine(engine)">
                <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                  <Icon class="size-6 text-slate-400" :icon="engine.icon" />
                </span>
                <span class="font-medium">{{ engine.name }}</span>
                <span class="min-w-0 truncate text-xs text-slate-400">{{ engine.displayUrl }}</span>
              </button>
              <button
                class="u-transition grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 opacity-0 hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100"
                type="button"
                :aria-label="`删除 ${engine.name}`"
                draggable="false"
                @click.stop="removeEngine(engine)"
                @dragstart.prevent
              >
                <Icon class="size-6" icon="ph:minus" />
              </button>
            </div>
          </div>
        </Transition>

        <Transition
          enter-active-class="u-transition"
          enter-from-class="-translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="u-transition"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-1 opacity-0"
        >
          <div
            v-if="isSearchHistoryVisible"
            class="absolute left-0 top-full z-10 mt-3 grid w-full gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgb(15_23_42_/_12%)]"
          >
            <div v-if="searchHistory.length === 0" class="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-slate-400">
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                <Icon class="size-5 text-slate-400" icon="ph:clock-counter-clockwise" />
              </span>
              <span class="font-medium">暂无搜索记录</span>
            </div>
            <div
              v-for="historyItem in searchHistory"
              :key="historyItem"
              class="u-transition group flex items-start gap-3 rounded-3xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <button class="flex min-w-0 flex-1 items-start gap-3 text-left" type="button" @click="selectHistoryItem(historyItem)">
                <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                  <Icon class="size-5 text-slate-400" icon="ph:clock-counter-clockwise" />
                </span>
                <span class="min-w-0 flex-1 break-all py-2 font-medium leading-5">{{ historyItem }}</span>
              </button>
              <button
                class="u-transition grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 opacity-0 hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100"
                type="button"
                :aria-label="`删除搜索历史 ${historyItem}`"
                @click.stop="removeHistoryItem(historyItem)"
              >
                <Icon class="size-5" icon="ph:x" />
              </button>
            </div>
          </div>
        </Transition>

        <Transition
          enter-active-class="u-transition"
          enter-from-class="-translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="u-transition"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-1 opacity-0"
        >
          <div
            v-if="isSettingsMenuOpen"
            class="absolute left-0 top-full z-10 mt-3 grid w-full gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgb(15_23_42_/_12%)]"
          >
            <button
              class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              type="button"
              @click="openInNewWindow = !openInNewWindow"
            >
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                <Icon class="size-5 text-slate-400" icon="ph:arrow-square-out" />
              </span>
              <span class="min-w-0 flex-1 font-medium">新窗口打开</span>
              <span class="u-transition flex h-6 w-11 items-center rounded-full p-1" :class="openInNewWindow ? 'bg-slate-700' : 'bg-slate-200'">
                <span class="u-transition size-4 rounded-full bg-white shadow-sm" :class="openInNewWindow ? 'translate-x-5' : 'translate-x-0'" />
              </span>
            </button>
            <button
              class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              type="button"
              @click="toggleSearchHistory"
            >
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                <Icon class="size-5 text-slate-400" icon="ph:clock-counter-clockwise" />
              </span>
              <span class="min-w-0 flex-1 font-medium">搜索记录</span>
              <span
                class="u-transition flex h-6 w-11 items-center rounded-full p-1"
                :class="isSearchHistoryEnabled ? 'bg-slate-700' : 'bg-slate-200'"
              >
                <span
                  class="u-transition size-4 rounded-full bg-white shadow-sm"
                  :class="isSearchHistoryEnabled ? 'translate-x-5' : 'translate-x-0'"
                />
              </span>
            </button>
            <div
              class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                <Icon class="size-5 text-slate-400" icon="ph:image" />
              </span>
              <span class="min-w-0 flex-1 font-medium">自定义背景</span>
              <input ref="backgroundInput" class="hidden" accept="image/*" type="file" @change="updateCustomBackground" />
              <button
                v-if="customBackground"
                class="u-transition rounded-full px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                type="button"
                @click="clearCustomBackground"
              >
                清除
              </button>
              <button
                class="u-transition rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                type="button"
                @click="chooseCustomBackground"
              >
                上传
              </button>
            </div>
            <div
              class="u-transition flex items-center gap-3 rounded-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100">
                <Icon class="size-5 text-slate-400" icon="ph:palette" />
              </span>
              <span class="min-w-0 flex-1 font-medium">主题配色</span>
              <span class="flex shrink-0 rounded-full bg-slate-100 p-1">
                <button
                  class="u-transition rounded-full px-2.5 py-1 text-xs"
                  :class="themeMode === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'"
                  type="button"
                  @click="themeMode = 'light'"
                >
                  浅色
                </button>
                <button
                  class="u-transition rounded-full px-2.5 py-1 text-xs"
                  :class="themeMode === 'dark' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'"
                  type="button"
                  @click="themeMode = 'dark'"
                >
                  深色
                </button>
                <button
                  class="u-transition rounded-full px-2.5 py-1 text-xs"
                  :class="themeMode === 'system' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'"
                  type="button"
                  @click="themeMode = 'system'"
                >
                  跟随系统
                </button>
              </span>
            </div>
          </div>
        </Transition>
      </form>
    </section>
  </main>
</template>
