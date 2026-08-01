<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  history: string[];
  isOpen: boolean;
}>();

const emit = defineEmits<{
  remove: [historyItem: string];
  select: [historyItem: string];
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
      <div v-if="history.length === 0" class="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-slate-400 dark:text-slate-500">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:clock-counter-clockwise" />
        </span>
        <span class="font-medium">暂无搜索记录</span>
      </div>

      <div
        v-for="historyItem in history"
        :key="historyItem"
        class="u-transition group flex items-start gap-3 rounded-3xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <button class="flex min-w-0 flex-1 items-start gap-3 text-left" type="button" @click="emit('select', historyItem)">
          <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Icon class="size-5 text-slate-400 dark:text-slate-500" icon="ph:clock-counter-clockwise" />
          </span>
          <span class="min-w-0 flex-1 break-all py-2 font-medium leading-5">{{ historyItem }}</span>
        </button>

        <button
          class="u-transition grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 opacity-0 hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          type="button"
          :aria-label="`删除搜索历史 ${historyItem}`"
          @click.stop="emit('remove', historyItem)"
        >
          <Icon class="size-5" icon="ph:x" />
        </button>
      </div>
    </div>
  </Transition>
</template>
