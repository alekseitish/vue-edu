<template>
  <div class="my-card row mb-3 py-2 " @click="$emit('select-card', props.book.id)">
    <div class="col-auto">
      <img :src="props.book.thumbnail" class="rounded" alt="thumbnail">
    </div>
    <div class="col">
      <h5 class="">{{ props.book.title }}</h5>
      <p data-bs-toggle="popover" data-bs-trigger="hover" :data-bs-content="props.book.description">
        {{ desc }}
      </p>
    </div>
  </div>
</template>

<script setup>

import { computed } from "vue";

const props = defineProps({
  book: { type: Object, required: true }
});

const desc = computed(() => {
  return props.book.description.length > 300
    ? props.book.description.slice(0, 300) + "..."
    : props.book.description;
});

</script>

<style lang="scss" scoped>
.my-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: .7;
  }
}

</style>