<template>
  <nav class="navbar navbar-dark bg-primary">
    <div class="container-fluid">
      <div class="navbar-brand m-auto py-0">{{ props.title }}</div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: "" },
});
</script>

<style lang="scss" scoped>
.navbar-brand {
  font-size: 1.1rem;
}
</style>
