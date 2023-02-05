<template>
    <div class="row justify-content-start">
      <author-card
        v-for="(author, index) in props.authors"
        :author="author"
        :key="index"
        @to-edit="$emit('to-edit', $event)"
        @remove-card="$emit('remove-author', $event)"
      />
    </div>
</template>

<script setup>
import AuthorCard from "@/components/AuthorCard.vue";

const props = defineProps({
  authors: { type: Array, required: true },
});
</script>

<style scoped></style>