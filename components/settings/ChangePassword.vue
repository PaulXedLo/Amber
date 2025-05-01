<script setup>
import "animate.css";
const toast = useToast();
const user = useUserStore();

async function updateUserPassword(values) {
  try {
    await user.updateUserPassword(values.password);
    toast.success({
      message: "Successfully updated password",
      position: "topRight",
      timeout: 3000,
    });
  } catch (error) {
    console.log("Failed to update password", error);
    toast.error({
      message: "Could not update password",
      timeout: 3000,
      position: "topRight",
    });
  }
}
const schema = {
  password: "required|min:6|max:30",
  confirmPassword: "confirmed:@password",
};
</script>
<template>
  <div
    class="max-w-2xl mx-auto px-4 py-12 text-white animate__animated animate__fadeInUp animate__faster"
  >
    <h2 class="text-3xl font-bold mb-6 text-center">Password & Security</h2>
    <VeeForm
      @submit="updateUserPassword"
      :validation-schema="schema"
      class="flex flex-col gap-6"
    >
      <div>
        <label
          class="block mb-1 focus:outline-0 text-sm font-medium text-gray-300"
          >New Password</label
        >
        <div class="flex flex-col gap-3">
          <VeeField
            name="password"
            type="password"
            placeholder="Enter new password"
            class="w-full p-3 focus:outline-0 rounded border-b border-amber-400 bg-slate-800 text-white"
          />
          <ErrorMessage
            name="password"
            class="text-red-400 text-center font-bold text-sm mt-1"
          />
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-300"
          >Confirm Password</label
        >
        <div class="flex flex-col gap-3">
          <VeeField
            name="confirmPassword"
            type="password"
            placeholder="Repeat password"
            class="w-full p-3 rounded focus:outline-0 border-b border-amber-400 bg-slate-800 text-white"
          />
          <ErrorMessage
            name="confirmPassword"
            class="text-red-400 text-center font-bold text-sm mt-1"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="rounded-full cursor-pointer active:translate-y-0.5 mt-4 px-6 py-3 bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
      >
        Change Password
      </button>
    </VeeForm>
  </div>
</template>
