const isOpen = ref(false);
const postId = ref(null);
const posts = usePostsStore();

const activePost = computed(() => {
  return (
    posts.userPosts.find((p) => p.posts.id === postId.value) ||
    posts.allPosts.find((p) => p.posts.id === postId.value) ||
    null
  );
});

export function useModal() {
  function openModalById(postIdValue: string) {
    postId.value = postIdValue;
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
    postId.value = null;
  }

  return {
    isOpen,
    activePost,
    openModal: openModalById,
    closeModal,
  };
}
