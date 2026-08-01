<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Icon } from "@iconify/vue";
import type { Bookmark } from "../types";

// 书签列表和是否启用书签区。
defineProps<{
  bookmarks: Bookmark[];
  isEnabled: boolean;
}>();

// 通知父组件新增、打开或编辑书签。
const emit = defineEmits<{
  add: [];
  edit: [bookmark: Bookmark];
  open: [bookmark: Bookmark];
}>();

const hoveredBookmark = ref<Bookmark | null>(null);
let hoverTimer: number | null = null;

function startBookmarkHover(bookmark: Bookmark) {
  stopBookmarkHover();

  hoverTimer = window.setTimeout(() => {
    hoveredBookmark.value = bookmark;
  }, 1000);
}

function stopBookmarkHover() {
  if (hoverTimer) {
    window.clearTimeout(hoverTimer);
    hoverTimer = null;
  }

  hoveredBookmark.value = null;
}

onBeforeUnmount(stopBookmarkHover);
</script>

<template>
  <!-- 书签网格：最多显示三行，宽度和搜索栏对齐 -->
  <div
    class="c-bookmark-grid mt-8 grid h-[232px] w-full max-w-[600px] grid-cols-[repeat(8,56px)] justify-between gap-y-8 overflow-hidden"
    :data-enabled="isEnabled"
    data-bookmark-area
  >
    <!-- 已保存的书签项 -->
    <a
      v-for="bookmark in bookmarks"
      :key="bookmark.displayUrl"
      class="u-transition group relative grid size-14 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
      :href="bookmark.url"
      :title="bookmark.name"
      @click.prevent="emit('open', bookmark)"
      @mouseleave="stopBookmarkHover"
      @mouseenter="startBookmarkHover(bookmark)"
    >
      <!-- 书签图标 -->
      <span class="grid size-14 place-items-center rounded-full">
        <img class="size-8 rounded-full" :alt="bookmark.name" :src="bookmark.iconUrl" />
      </span>

      <!-- 鼠标停留 1 秒后显示的更多按钮 -->
      <button
        v-if="hoveredBookmark === bookmark"
        class="u-transition absolute right-0 top-0 z-10 grid size-5 place-items-center rounded-full bg-slate-200 text-slate-500 shadow-sm hover:bg-slate-300 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100"
        type="button"
        :aria-label="`编辑书签 ${bookmark.name}`"
        @click.prevent.stop="emit('edit', bookmark)"
      >
        <Icon class="size-3.5" icon="ph:dots-three-bold" />
      </button>
    </a>

    <!-- 新增书签按钮，永远显示在书签列表最后 -->
    <button
      class="u-transition group grid size-14 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
      type="button"
      aria-label="添加书签"
      @click="emit('add')"
    >
      <Icon class="u-transition size-8 group-hover:text-slate-600 dark:group-hover:text-slate-300" icon="ph:plus" />
    </button>
  </div>
</template>
