<template>
  <main class="mt-3 px-4">
    <book-card
      v-for="(book, index) in props.books"
      :book="book"
      :key="index"
      @select-card="$emit('select-book', $event)"
    />
  </main>
</template>

<script setup>
import BookCard from "@/components/BookCard.vue";

const props = defineProps({
  books: { type: Array, default: [] }
});


</script>

<style scoped>

</style>