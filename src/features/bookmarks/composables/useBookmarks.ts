import { onMounted, ref } from "vue";
import type { Bookmark } from "../../../shared/types";
import { getDisplayUrl, getFaviconUrl, getNameFromUrl, getNormalizedUrl } from "../../../shared/url";

export function useBookmarks() {
  const bookmarks = ref<Bookmark[]>([]);
  const editingBookmark = ref<Bookmark | null>(null);
  const isBookmarkModalOpen = ref(false);
  const newBookmarkName = ref("");
  const newBookmarkUrl = ref("");

  function openBookmarkModal() {
    editingBookmark.value = null;
    newBookmarkName.value = "";
    newBookmarkUrl.value = "";
    isBookmarkModalOpen.value = true;
  }

  function openBookmarkEditor(bookmark: Bookmark) {
    editingBookmark.value = bookmark;
    newBookmarkName.value = bookmark.name;
    newBookmarkUrl.value = bookmark.url;
    isBookmarkModalOpen.value = true;
  }

  function closeBookmarkModal() {
    isBookmarkModalOpen.value = false;
    editingBookmark.value = null;
  }

  function saveBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks.value));
  }

  function saveBookmark() {
    const trimmedUrl = newBookmarkUrl.value.trim();

    if (!trimmedUrl) {
      return;
    }

    try {
      const url = getNormalizedUrl(trimmedUrl);
      const displayUrl = getDisplayUrl(trimmedUrl);
      const name = newBookmarkName.value.trim() || getNameFromUrl(displayUrl);
      const bookmark: Bookmark = {
        name,
        url,
        displayUrl,
        iconUrl: getFaviconUrl(displayUrl),
      };

      if (editingBookmark.value) {
        bookmarks.value = bookmarks.value.map((item) => (item === editingBookmark.value ? bookmark : item));
      } else {
        bookmarks.value = [bookmark, ...bookmarks.value.filter((item) => item.displayUrl !== bookmark.displayUrl)];
      }

      saveBookmarks();
      closeBookmarkModal();
    } catch {
      newBookmarkUrl.value = "";
    }
  }

  function openBookmark(bookmark: Bookmark) {
    window.location.href = bookmark.url;
  }

  function removeBookmark(bookmark: Bookmark) {
    bookmarks.value = bookmarks.value.filter((item) => item !== bookmark);
    saveBookmarks();
  }

  function removeEditingBookmark() {
    if (!editingBookmark.value) {
      return;
    }

    removeBookmark(editingBookmark.value);
    closeBookmarkModal();
  }

  onMounted(() => {
    try {
      const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks") ?? "[]");
      bookmarks.value = Array.isArray(storedBookmarks) ? storedBookmarks.filter((item) => item?.name && item?.url && item?.displayUrl) : [];
    } catch {
      bookmarks.value = [];
    }
  });

  return {
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
    removeBookmark,
    saveBookmark,
  };
}
