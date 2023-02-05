<template>
    <book-card
      v-for="(book, index) in props.books"
      :book="book"
      :key="index"
      @select-card="$emit('select-book', $event)"
      @remove-card="$emit('remove-book', $event)"
    />
</template>

<script setup>
import BookCard from "@/components/BookCard.vue";
import { computed, ref } from "vue";

const props = defineProps({
  books: { type: Array, required: true },
});
const emit = defineEmits(["select-book", "remove-book"]);

</script>

<style scoped></style>