<script setup>
import Toast from "vue-toastification";
const { useToast } = Toast;
const user = useUserStore();
const toast = useToast();
const {
  profilePic: profilePicture,
  fullName,
  username,
  bio,
} = storeToRefs(user);

// PROFILE PICTURE EDIT

const selectedFile = ref(null);
const isUploading = ref(false);
const fileInput = ref(null);
const usernameEdit = ref(null);
function handleNewPicture(event) {
  const file = event.target?.files?.[0];
  if (file) {
    selectedFile.value = file;
  }
}
async function handlePictureChange() {
  if (selectedFile.value) {
    try {
      isUploading.value = true;
      await user.updateProfile({ profilePicture: selectedFile.value });
      selectedFile.value = null;
      toast.success("Updated profile picture successfully", {
        timeout: 2000,
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
    } finally {
      isUploading.value = false;
    }
  }
}
function triggerFileInput() {
  fileInput.value?.click();
}
// PREVIEW PROFILE PICTURE
const previewUrl = computed(() => {
  return selectedFile.value
    ? URL.createObjectURL(selectedFile.value)
    : profilePicture.value;
});

// USERNAME EDIT

let editingUsername = ref(false);
const newUsernameValue = ref(fullName);
async function saveUsername() {
  try {
    await user.updateProfile({ fullName: newUsernameValue.value });
    toast.success("Updated name successfully", {
      timeout: 2000,
      position: "top-center",
    });
    toggleEditingUsername();
  } catch (error) {
    alert(error);
  }
}
function toggleEditingUsername() {
  editingUsername.value = !editingUsername.value;
}

// BIO EDIT

let editingBio = ref(false);
const bioValue = ref(bio);
async function saveBio() {
  try {
    await user.updateProfile({ bio: bioValue.value });
    toast.success("Updated bio successfully", {
      timeout: 2000,
      position: "top-center",
    });
    toggleEditingBio();
  } catch (error) {
    console.log(error);
  }
}
function toggleEditingBio() {
  editingBio.value = !editingBio.value;
}
</script>

<template>
  <div
    class="w-full max-w-4xl mx-auto px-6 flex flex-col gap-12 mt-10 animate__animated animate__fadeInUp animate__faster"
  >
    <!-- Profile Picture Section -->
    <div class="flex flex-col items-center gap-4">
      <div
        class="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg cursor-pointer"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleNewPicture"
        />
        <NuxtImg
          :src="previewUrl"
          alt="Profile Picture"
          class="w-full h-full object-cover group-hover:opacity-60 transition duration-300"
        />
        <div
          class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition"
        >
          Edit
        </div>

        <!-- Loader on Upload -->
        <div
          v-if="isUploading"
          class="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold animate-pulse"
        >
          Uploading...
        </div>
      </div>

      <!-- Confirm Button -->
      <div v-if="selectedFile && !isUploading" class="mt-2">
        <button
          @click.prevent="handlePictureChange"
          class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-md transition"
        >
          Confirm New Picture
        </button>
      </div>

      <!-- Full Name and Username -->
      <div class="text-center mt-4">
        <div class="flex flex-row gap-2 items-center">
          <h1 class="text-2xl font-extrabold" v-if="!editingUsername">
            {{ fullName }}
          </h1>
          <input
            type="text"
            v-model="newUsernameValue"
            class="text-2xl font-bold"
            v-else
          />
          <div v-if="!editingUsername">
            <button
              @click="toggleEditingUsername"
              class="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300 transition"
            >
              <Icon size="18" name="pepicons-pencil:pen-circle" />
              Edit
            </button>
          </div>
          <div v-else="editingUsername">
            <button
              @click="saveUsername"
              class="cursor-pointer flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full transition"
            >
              Save
            </button>
          </div>
        </div>

        <p class="text-slate-400">@{{ username }}</p>
      </div>
    </div>

    <!-- Bio Section -->
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold text-slate-300">Bio</h2>

        <div v-if="!editingBio">
          <button
            @click="toggleEditingBio"
            class="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300 transition"
          >
            <Icon size="22" name="pepicons-pencil:pen-circle" />
            Edit
          </button>
        </div>
        <div v-else>
          <button
            @click="saveBio"
            class="cursor-pointer flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full transition"
          >
            Save
          </button>
        </div>
      </div>

      <textarea
        v-model="bioValue"
        :disabled="!editingBio"
        class="w-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 resize-none h-32 transition"
        placeholder="Tell us about yourself..."
      ></textarea>
    </div>
  </div>
</template>
