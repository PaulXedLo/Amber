import type { SearchResult } from "@/types/search";
const searchQuery = ref<string | null>("");
const showSearchBar = ref<boolean>(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
export function useSearch() {
  const searchResults = ref<SearchResult[]>([]);
  const isLoading = ref(false);
  // Ui methods
  // Open search bar
  function openSearch() {
    showSearchBar.value = true;
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
  // Close search bar
  function closeSearch() {
    showSearchBar.value = false;
    searchQuery.value = "";
  }
  // Clear search input
  function clearSearch() {
    searchQuery.value = "";
    searchInputRef.value?.focus();
  }
  // API call
  async function searchUsers() {
    if (!searchQuery.value || searchQuery.value.trim() === "") return;
    isLoading.value = true;
    // Fetch search results from the API
    try {
      const data = await $fetch<SearchResult[]>("/api/search", {
        query: { q: searchQuery.value.trim() },
      });
      // Update search results
      console.log(data);
      searchResults.value = data;
      // Navigate to search results page
      await navigateTo(
        `/search/${encodeURIComponent(searchQuery.value.trim())}`
      );
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      isLoading.value = false;
    }
  }
  return {
    // state
    showSearchBar,
    searchQuery,
    searchInputRef,
    // methods
    openSearch,
    closeSearch,
    clearSearch,
    searchUsers,
  };
}
