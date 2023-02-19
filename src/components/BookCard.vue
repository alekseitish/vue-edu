<template>
  <div
    class="my-card row mb-3 py-2"
    @click="$emit('select-card', props.book.id)"
  >
    <div class="col-auto">
      <img :src="props.book.thumbnail" class="rounded" alt="thumbnail" />
    </div>
    <div class="col">
      <h5>{{ props.book.title }}</h5>
      <h6>{{ authors }}</h6>
      <p>{{ desc }}</p>
      <em> {{ categories }}</em>
      <div class="d-flex justify-content-between mt-1">
        <div>ISBN: {{ props.book.ISBN }}</div>
        <div>{{ props.book.publishedDate }}</div>
        <div>{{ price }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  book: { type: Object, required: true },
});
const emit = defineEmits(["select-card", "remove-card"]);

const authors = computed(() =>
  props.book.authors
    ? props.book.authors.map(author => author.fio).join(", ")
    : ""
);
const desc = computed(() => {
  return props.book.description.length > 200
    ? props.book.description.slice(0, 200) + "..."
    : props.book.description;
});
const categories = computed(() => props.book.categories ? props.book.categories.join(", ") : "");
const price = computed(() => !!props.book.price.amount ? `${props.book.price.amount} ${props.book.price.currencyCode}` : "")
</script>

<style lang="scss" scoped>
.my-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}
</style>
