<script setup lang="ts">
const name = defineModel<string>("name", { required: true });
const url = defineModel<string>("url", { required: true });

defineProps<{
  isEditing: boolean;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  delete: [];
  submit: [];
}>();
</script>

<template>
  <Transition
    enter-active-class="u-transition"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="u-transition"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-6"
      @click.self="emit('close')"
    >
      <Transition
        appear
        enter-active-class="u-transition"
        enter-from-class="translate-y-3 scale-95 opacity-0"
        enter-to-class="translate-y-0 scale-100 opacity-100"
        leave-active-class="u-transition"
        leave-from-class="translate-y-0 scale-100 opacity-100"
        leave-to-class="translate-y-3 scale-95 opacity-0"
      >
        <form
          v-if="isOpen"
          class="grid w-full max-w-[420px] gap-4 rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgb(15_23_42_/_18%)] dark:bg-slate-900"
          @submit.prevent="emit('submit')"
        >
          <div class="grid gap-1.5">
            <label class="text-sm font-medium text-slate-600 dark:text-slate-300" for="bookmark-name">名称</label>
            <input
              id="bookmark-name"
              v-model="name"
              class="u-transition rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              autocomplete="off"
            />
          </div>

          <div class="grid gap-1.5">
            <label class="text-sm font-medium text-slate-600 dark:text-slate-300" for="bookmark-url">网址</label>
            <input
              id="bookmark-url"
              v-model="url"
              class="u-transition rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              autocomplete="off"
              type="text"
            />
          </div>

          <div class="flex items-center justify-between gap-2 pt-2">
            <button
              v-if="isEditing"
              class="u-transition rounded-full px-4 py-2 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              type="button"
              @click="emit('delete')"
            >
              删除
            </button>
            <span v-else />
            <div class="flex justify-end gap-2">
              <button
                class="u-transition rounded-full px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                type="button"
                @click="emit('close')"
              >
                取消
              </button>
              <button
                class="u-transition rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                type="submit"
              >
                {{ isEditing ? "保存" : "添加" }}
              </button>
            </div>
          </div>
        </form>
      </Transition>
    </div>
  </Transition>
</template>
