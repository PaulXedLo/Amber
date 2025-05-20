<script setup lang="ts">
const route = useRoute();
const typeParam = route.params.type;
const type = Array.isArray(typeParam) ? typeParam.join(",") : typeParam;
</script>
<template>
  <!--Page not found component (Post, Profile)-->
  <PageNotFound :type="type" />
</template>
