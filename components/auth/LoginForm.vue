<script setup>
import "animate.css";
const toast = useToast();
const emit = defineEmits(["switch-tab"]);
const user = useUserStore();
const schema = {
  password: "required|min:3|max:30",
  email: "required|email|min:3|max:30",
};

async function loginUser(values) {
  const result = await user.logInUser(values);

  if (result) {
    toast.success({
      message: "Logged in successfully",
      timeout: 2000,
      position: "topCenter",
    });
    setTimeout(() => {
      navigateTo("/home");
    }, 2000);
  }
}

function showRegister() {
  emit("switch-tab");
}
onMounted(() => {
  if (!user.isSignedIn) {
    toast.info({
      message: "Please log in to the website!",
      timeout: 5000,
      position: "topCenter",
    });
  }
});
</script>
<template>
  <Toaster richColors position="top-center" />
  <VeeForm
    :validationSchema="schema"
    class="backdrop-blur-md bg-slate-800/70 border border-slate-700 shadow-lg rounded-2xl px-8 py-6 w-[22rem] animate__animated neon-pulse"
    @submit="loginUser"
  >
    <legend class="fieldset-legend text-white font-bold">Login</legend>
    <label class="label text-gray-200">Email</label>
    <VeeField
      name="email"
      type="email"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="Email"
    />
    <ErrorMessage
      name="email"
      class="flex font-bold mt-2 justify-center text-red-500"
    />
    <label class="label text-gray-200">Password</label>
    <VeeField
      name="password"
      type="password"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="Password"
      @click.prevent="showPasswordRequirements = true"
    />
    <ErrorMessage
      name="password"
      class="flex font-bold mt-2 justify-center text-red-500"
    />
    <button
      class="w-full cursor-pointer bg-amber-500 text-white font-semibold py-2 rounded-md mt-4 hover:bg-amber-600 transition shadow hover:shadow-lg"
    >
      Login
    </button>
    <a
      href="#"
      @click.prevent="showRegister"
      class="block mt-4 text-center text-sm text-slate-300 hover:text-amber-300 transition"
    >
      Don’t have an account? <span class="underline">Register now</span>
    </a>
  </VeeForm>
</template>
<style scoped>
.neon-pulse {
  animation: neonPulse 4s infinite ease-in-out;
}
</style>
