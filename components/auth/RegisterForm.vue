<script setup>
import "animate.css";
const password = ref("");
const showPasswordRequirements = ref(false);
const user = useUserStore();
const toast = useToast();
const passwordRequirements = reactive([
  {
    id: "minPassword",
    text: "At least 3 characters long",
    check: (val) => val.length >= 3,
  },
  {
    id: "number",
    text: "At least one number",
    check: (val) => /\d/.test(val),
  },
  {
    id: "uppercase",
    text: "At least one uppercase letter",
    check: (val) => /[A-Z]/.test(val),
  },
]);
const schema = {
  password: "required|min:3|max:30",
  email: "required|email|min:3|max:30",
  age: "required|minAge:16|digits:2",
  confirm_password: "passwords_mismatch:@password",
  name: "required|min:5|max:40|alphaSpaces",
  username: "required|min:5|max:15|alpha",
};

const allRequirementsMet = computed(() => {
  return passwordRequirements.every((req) => req.check(password.value));
});

const emit = defineEmits(["switch-tab"]);

function switchTab() {
  emit("switch-tab");
}

async function registerUser(values) {
  try {
    const result = await user.signUpUser(values);
    if (result.success) {
      toast.success({
        //
        message: "Registration successful! Please check your email to verify.",
        timeout: 5000,
        position: "topCenter",
      });
      navigateTo("/home");
    } else {
      toast.error({
        message:
          result.error?.message || "Registration failed. Please try again.",
        timeout: 5000,
        position: "topCenter",
      });
    }
  } catch (error) {
    console.error("Caught registration error in component:", error);
    toast.error({
      message: "An unexpected error occurred during registration.",
      timeout: 5000,
      position: "topCenter",
    });
  }
}

watch(allRequirementsMet, (met) => {
  if (met) {
    showPasswordRequirements.value = false;
  }
});
</script>

<template>
  <VeeForm
    :validationSchema="schema"
    @submit="registerUser"
    class="backdrop-blur-md bg-slate-800/70 border border-slate-700 shadow-lg rounded-2xl px-8 py-6 w-[22rem] animate__animated neon-pulse"
  >
    <legend class="fieldset-legend text-white font-bold">Register</legend>

    <label class="label text-gray-200">Full Name</label>
    <VeeField
      name="name"
      type="text"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="Full name"
    />
    <ErrorMessage
      name="name"
      class="flex font-bold mt-2 justify-center text-red-500"
    />

    <label class="label text-gray-200">Username</label>
    <VeeField
      name="username"
      type="text"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="@username"
    />
    <ErrorMessage
      name="username"
      class="flex font-bold mt-2 justify-center text-red-500"
    />

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
      v-model="password"
      type="password"
      @focus="showPasswordRequirements = true"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="Password"
    />
    <ErrorMessage
      name="password"
      class="flex font-bold mt-2 justify-center text-red-500"
    />
    <!-- Password Requirements Live -->
    <ul
      v-if="showPasswordRequirements"
      class="mt-2 text-xs font-bold text-center"
    >
      <li
        v-for="requirement in passwordRequirements"
        :key="requirement.id"
        class="flex justify-center"
        :class="{
          'text-green-400': requirement.check(password),
          'text-slate-400': !requirement.check(password),
        }"
      >
        • {{ requirement.text }}
      </li>
    </ul>

    <label class="label text-gray-200 mt-2">Confirm Password</label>
    <VeeField
      name="confirm_password"
      type="password"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="Confirm Password"
    />
    <ErrorMessage
      name="confirm_password"
      class="flex font-bold mt-2 justify-center text-red-500"
    />

    <label class="label text-gray-200">Age</label>
    <VeeField
      name="age"
      type="number"
      class="input w-full bg-slate-700 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      placeholder="Age"
    />
    <ErrorMessage
      name="age"
      class="flex font-bold mt-2 justify-center text-red-500"
    />

    <!-- Submit Button -->
    <button
      class="w-full cursor-pointer bg-amber-500 text-white font-semibold py-2 rounded-md mt-4 hover:bg-amber-600 transition shadow hover:shadow-lg"
    >
      Register
    </button>

    <!-- Link to Login -->
    <a
      href="#"
      @click.prevent="switchTab"
      class="block mt-4 text-center text-sm text-slate-300 hover:text-amber-300 transition"
    >
      Already have an account? <span class="underline">Log in</span>
    </a>
  </VeeForm>
</template>

<style scoped>
.neon-pulse {
  animation: neonPulse 4s infinite ease-in-out;
}
</style>
