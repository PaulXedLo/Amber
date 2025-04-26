<script setup>
const supabase = useSupabaseClient();
const profile = ref(null);
const route = useRoute();
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("username", route.params.username)
  .single();

if (error) {
  console.error("Profile not found", error);
} else {
  profile.value = data;
}
</script>
<template>
  <div v-if="profile">
    <h1>{{ profile.username }}</h1>
    <h1>{{ profile.email }}</h1>
    <h1>{{ profile.age }}</h1>
  </div>
</template>
