<template>
  <nav class="navbar navbar-dark bg-primary">
    <div class="container-fluid">
      <a href="#" data-bs-target="#sidebar" data-bs-toggle="collapse" class="btn btn-primary">Меню</a>
      <div class="navbar-brand m-auto">{{ props.title }}</div>
    </div>
  </nav>
</template>

<script setup>

const props = defineProps({
  title: {type: String, default: ""}
})
</script>

<style lang="scss" scoped>
</style>