<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { SearchEngine } from "../../../shared/types";

const newEngineUrl = defineModel<string>("newEngineUrl", { required: true });

defineProps<{
  draggedEngine: SearchEngine | null;
  isAddingEngine: boolean;
  isOpen: boolean;
  searchEngines: SearchEngine[];
}>();

const emit = defineEmits<{
  add: [];
  dragEnd: [];
  dragMove: [engine: SearchEngine];
  dragStart: [engine: SearchEngine, event: DragEvent];
  remove: [engine: SearchEngine];
  select: [engine: SearchEngine];
}>();
</script>

<template>
  <Transition
    enter-active-class="u-transition"
    enter-from-class="-translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="u-transition"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-1 opacity-0"
  >
    <div
      v-if="isOpen"
      class="absolute left-0 top-full z-10 mt-3 grid w-full gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgb(15_23_42_/_12%)] dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-6 text-slate-400 dark:text-slate-500" icon="ph:plus" />
        </span>
        <input
          v-model="newEngineUrl"
          class="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-0 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          :disabled="isAddingEngine"
          :placeholder="isAddingEngine ? '正在识别搜索规则...' : '输入搜索引擎地址后回车'"
          type="text"
          @keydown.enter.prevent="emit('add')"
        />
        <Icon v-if="isAddingEngine" class="size-5 shrink-0 animate-spin text-slate-400 dark:text-slate-500" icon="ph:spinner-gap" />
      </div>

      <div
        v-for="engine in searchEngines"
        :key="engine.name"
        class="c-engine-row u-transition group flex cursor-grab items-center gap-3 rounded-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:cursor-grabbing dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        :data-dragging="draggedEngine === engine"
        draggable="true"
        @dragend="emit('dragEnd')"
        @dragenter.prevent="emit('dragMove', engine)"
        @dragover.prevent
        @dragstart="emit('dragStart', engine, $event)"
      >
        <button class="flex min-w-0 flex-1 items-center gap-3 text-left" type="button" @click="emit('select', engine)">
          <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Icon class="size-6 text-slate-400 dark:text-slate-500" :icon="engine.icon" />
          </span>
          <span class="font-medium">{{ engine.name }}</span>
          <span class="min-w-0 truncate text-xs text-slate-400 dark:text-slate-500">{{ engine.displayUrl }}</span>
        </button>

        <button
          class="u-transition grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 opacity-0 hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          type="button"
          :aria-label="`删除 ${engine.name}`"
          draggable="false"
          @click.stop="emit('remove', engine)"
          @dragstart.prevent
        >
          <Icon class="size-6" icon="ph:minus" />
        </button>
      </div>
    </div>
  </Transition>
</template>
