const isOpen = ref(false);
const activePost = ref(null);
export function useModal() {
  async function openModal(post: any) {
    isOpen.value = true;
    activePost.value = post;
  }
  async function closeModal() {
    isOpen.value = false;
    activePost.value = null;
  }
  return {
    isOpen,
    activePost,
    openModal,
    closeModal,
  };
}
