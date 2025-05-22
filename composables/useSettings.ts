import type { SettingsEditState } from "~/types/settings";
export function useSettings() {
  const user = useUserStore();
  const toast = useToast();
  const {
    fullName,
    username,
    bio,
    isPrivate,
    likesNotifications,
    commentsNotifications,
    followNotifications,
  } = toRefs(user);

  // Change settings (Notifications, Privacy, etc.)
  async function changeSettings(type: string) {
    if (!type) return;
    try {
      await $fetch(`/api/notifications/preferences/${type}`, {
        method: "PATCH",
        query: { userId: user.userId },
      });
      toast.success({
        message: `${type} notification settings updated successfully!`,
        timeout: 3000,
        position: "topRight",
      });
      if (type === "likes") {
        likesNotifications.value = !likesNotifications.value;
      } else if (type === "follows") {
        followNotifications.value = !followNotifications.value;
      } else if (type === "comments") {
        commentsNotifications.value = !commentsNotifications.value;
      }
    } catch (err) {
      console.error(err);
      toast.error({
        message: `Error updating ${type} notification settings`,
        timeout: 3000,
        position: "topRight",
      });
    }
  }
  // Profile picture reactive
  const selectedFile = ref<SettingsEditState["selectedFile"]>(null);
  const isUploading = ref<SettingsEditState["isUploading"]>(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const previewUrl = computed(() => {
    return selectedFile.value
      ? URL.createObjectURL(selectedFile.value)
      : user.profilePic;
  });
  // Username reactive
  const usernameEdit = ref(null);
  const editingUsername = ref<SettingsEditState["editingUsername"]>(false);
  const newUsernameValue = ref(fullName);

  // Bio reactive
  const editingBio = ref<SettingsEditState["editingBio"]>(false);
  const bioValue = ref(bio);

  // Trigger file input click
  function triggerFileInput() {
    fileInput.value?.click();
  }
  // Handle new picture selection
  function handleNewPicture(event: any) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      selectedFile.value = file;
    }
  }
  // Handle picture change
  async function handlePictureChange() {
    if (selectedFile.value) {
      try {
        isUploading.value = true;
        await user.updateProfile({ profilePicture: selectedFile.value });
        selectedFile.value = null;
        toast.success({
          message: "Profile picture updated successfully!",
          timeout: 3000,
          position: "topRight",
        });
      } catch (err) {
        console.error(err);
        toast.error({
          message: "Error updating profile picture",
          timeout: 3000,
          position: "topRight",
        });
      } finally {
        isUploading.value = false;
      }
    }
  }

  // Toggle username edit mode
  function toggleEditingUsername() {
    editingUsername.value = !editingUsername.value;
  }

  // Handle username change
  async function saveUsername() {
    try {
      await user.updateProfile({ fullName: newUsernameValue.value });
      toast.success({
        message: "Username updated successfully!",
        timeout: 3000,
        position: "topRight",
      });
    } catch (err) {
      console.error(err);
      toast.error({
        message: "Error updating username",
        timeout: 3000,
        position: "topRight",
      });
    } finally {
      editingUsername.value = false;
    }
  }

  // Update bio
  async function saveBio() {
    try {
      await user.updateProfile({ bio: bioValue.value });
      toast.success({
        message: "Bio updated successfully!",
        timeout: 3000,
        position: "topRight",
      });
    } catch (err) {
      console.error(err);
      toast.error({
        message: "Error updating bio",
        timeout: 3000,
        position: "topRight",
      });
    } finally {
      editingBio.value = false;
    }
  }

  // Toggle Privacy
  async function togglePrivacy() {
    try {
      await user.updateProfile({ isPrivate: !isPrivate.value });
      toast.success({
        message: "Privacy settings updated successfully!",
        timeout: 3000,
        position: "topRight",
      });
    } catch (err) {
      console.error(err);
      toast.error({
        message: "Error updating privacy settings",
        timeout: 3000,
        position: "topRight",
      });
    }
  }
  return {
    // Notifications Methods and reactive properties
    likesNotifications,
    commentsNotifications,
    followNotifications,
    changeSettings,
    // Profile picture Methods and reactive properties
    fileInput,
    previewUrl,
    isUploading,
    selectedFile,
    handleNewPicture,
    handlePictureChange,
    triggerFileInput,
    // Username Methods and reactive properties
    fullName,
    username,
    usernameEdit,
    newUsernameValue,
    editingUsername,
    saveUsername,
    toggleEditingUsername,
    // Bio Methods and reactive properties
    bio,
    bioValue,
    editingBio,
    saveBio,
    // Privacy Methods and reactive properties
    isPrivate,
    togglePrivacy,
  };
}
