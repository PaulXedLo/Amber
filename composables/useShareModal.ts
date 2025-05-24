import { ref } from "vue";

const showShareModal = ref<boolean>(false);
const activeProfileId = ref<string | null>(null);
const shareUrl = ref<string>("");
const shareTitle = ref<string>("");
const shareText = ref<string>("");
const shareImage = ref<string>("");
const isCopied = ref<boolean>(false);
const shareDescription = ref<string>("");

function toggleShareModal(profileId: string) {
  const user = useUserStore();
  activeProfileId.value = profileId;
  if (activeProfileId.value) {
    shareUrl.value = `https://amber-black.vercel.app/profile/${user.username}`;
    shareTitle.value = `Check out ${user.fullName}'s profile!`;
    shareText.value = `Visit ${user.username}'s profile to see their latest posts and updates.`;
    shareImage.value = `${user.profilePic}`;
    shareDescription.value = `${user.bio}`;
  }
  showShareModal.value = !showShareModal.value;
}
function copyShareUrl() {
  const toast = useToast();
  navigator.clipboard.writeText(shareUrl.value);
  isCopied.value = true;
  toast.success({
    message: "Share URL copied to clipboard!",
    timeout: 3000,
    position: "topRight",
  });
}
export default function useShareModal() {
  return {
    showShareModal,
    activeProfileId,
    shareUrl,
    shareTitle,
    shareText,
    shareImage,
    isCopied,
    shareDescription,
    toggleShareModal,
    copyShareUrl,
  };
}
