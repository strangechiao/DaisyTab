import { computed, ref } from "vue";
import { defaultSearchEngines, enginePresets } from "../data/searchEngines";
import type { SearchEngine } from "../types";
import { getDisplayUrl, getNameFromUrl } from "../utils/url";

export function useSearchEngines() {
  const searchEngines = ref<SearchEngine[]>([...defaultSearchEngines]);
  const selectedEngine = ref<SearchEngine>(searchEngines.value[0]);
  const newEngineUrl = ref("");
  const draggedEngine = ref<SearchEngine | null>(null);
  const queryName = computed(() => selectedEngine.value.queryName);

  function selectEngine(engine: SearchEngine) {
    selectedEngine.value = engine;
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
            name: getNameFromUrl(displayUrl),
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

  return {
    addEngineFromInput,
    draggedEngine,
    endEngineDrag,
    moveDraggedEngine,
    newEngineUrl,
    queryName,
    removeEngine,
    searchEngines,
    selectEngine,
    selectedEngine,
    startEngineDrag,
  };
}
