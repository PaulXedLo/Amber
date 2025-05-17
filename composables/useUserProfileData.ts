import { usePublicStore } from "~/stores/profile/public";

export function useUserProfileData(usernameRef: string) {
  const publicStore = usePublicStore();
  const userStore = useUserStore();
  const { checkIfFollowing } = useFollow();
  const profile: any = ref(null);
  const posts = ref([]);
  const loadingProfile = ref(true);
  const fallbackImage = ref<string>(
    "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
  );
  const isOwnProfile = computed(() => {
    return (
      profile.value?.username &&
      userStore.username &&
      profile.value.username === userStore.username
    );
  });

  async function fetchProfile(currentUsername: string) {
    if (!currentUsername || typeof currentUsername !== "string") {
      profile.value = null;
      posts.value = [];
      loadingProfile.value = false;
      return;
    }

    loadingProfile.value = true;
    if (userStore.username === currentUsername) {
      navigateTo("/profile/me", { replace: true });
      loadingProfile.value = false;
      return;
    }

    try {
      const fetchedData = await publicStore.fetchPublicProfile(currentUsername);
      if (!fetchedData || !fetchedData.profiles) {
        console.error("Profile not found for username:", currentUsername);
        profile.value = null;
        posts.value = [];
      } else {
        profile.value = fetchedData.profiles;
        posts.value = fetchedData.posts || [];
        if (userStore.userId && profile.value?.id) {
          if (profile.value.username !== userStore.username) {
            await checkIfFollowing(profile.value.id);
          }
        }
      }
    } catch (error) {
      console.error(`Error loading profile for ${currentUsername}:`, error);
      profile.value = null;
      posts.value = [];
    } finally {
      loadingProfile.value = false;
    }
  }

  watch(
    usernameRef,
    async (newUsername, oldUsername) => {
      if (newUsername && (newUsername !== oldUsername || !profile.value)) {
        await fetchProfile(newUsername);
      } else if (!newUsername) {
        profile.value = null;
        posts.value = [];
        loadingProfile.value = false;
      }
    },
    { immediate: true }
  );

  return {
    profile,
    posts,
    loadingProfile,
    fallbackImage,
    isOwnProfile,
    fetchProfileData: fetchProfile,
  };
}
