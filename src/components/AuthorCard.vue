<template>
  <div class="card m-2">
    <div class="edit">
      <button
        type="button"
        class="btn btn-outline-primary bi bi-pencil"
        @click="$emit('to-edit', props.author.id)"
      />
      <button
        type="button"
        class="btn btn-outline-danger bi bi-trash3 ms-1"
        @click="$emit('remove-card', props.author.id)"
      />
    </div>
    <div class="card-body">
      <h6 class="card-title mb-3">{{ props.author.fio }}</h6>
      <p class="card-text">
        <span>Дата рождения: </span><em>{{ props.author.birthday }}</em>
      </p>
      <p class="card-text">
        <span>Пол: </span><em>{{ sex }}</em>
      </p>
      <p class="card-text">
        <span>Страна: </span><em>{{ props.author.residence }}</em>
      </p>
      <p class="card-text">
        <span>Книги: </span><em>{{ authorsBooks }}</em>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  author: { type: Object, required: true },
});
const emit = defineEmits(["to-edit", "remove-card"]);

const sex = computed(() => {
  return props.author.sex === "male" ? "мужской" : "женский";
})
const authorsBooks = computed(() =>
  props.author.books ? props.author.books.map((b) => b.title).join(", ") : ""
);
</script>

<style lang="scss" scoped>
.card {
  width: 31%;

  * {
    font-size: 0.8rem;
  }

  .edit {
    position: absolute;
    top: 5px;
    right: 5px;
    visibility: hidden;
  }

  &:hover> .edit {
    visibility: visible;
  }
}
</style>