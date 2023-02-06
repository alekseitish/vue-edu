<template>
  <div class="spinner-grow text-primary" role="status">
    <span class="visually-hidden">Загрузка...</span>
  </div>

</template>

<script setup>
</script>
<style lang="scss" scoped>
@import "@/assets/variables.scss";
.spinner-grow {
  position: absolute;
  margin: auto;
  left: $left-menu-width;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3rem;
  height: 3rem;
}

</style>