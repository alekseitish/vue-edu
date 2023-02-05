<template>
  <form @submit.prevent="onSubmit">
    <div class="row mb-3">
      <h6 for="fio" class="form-label">ФИО</h6>
      <div>
        <input
          type="text"
          class="form-control"
          id="fio"
          v-model="author.fio"
          required
        />
      </div>
    </div>
    <div class="row mb-3">
      <h6 for="birthday" class="form-label">Дата рождения</h6>
      <div>
        <input
          type="date"
          class="form-control"
          id="birthday"
          v-model="author.birthday"
        />
      </div>
    </div>
    <div class="row mb-3">
      <h6 for="sex" class="form-label">Пол</h6>
      <div>
        <select id="sex" class="form-select" v-model="author.sex">
          <option value="male">мужской</option>
          <option value="female">женский</option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <h6 for="residence" class="form-label">Страна проживания</h6>
      <div>
        <input
          type="text"
          class="form-control"
          id="residence"
          v-model="author.residence"
        />
      </div>
    </div>
    <div class="">
      <h6>Книга(и)</h6>
      <span class="d-flex align-items-center">
        <span
          v-for="(book, index) in author.books"
          :key="index"
          class="row-cols-auto"
        >
          <span class="book"
            >{{ book.title }}
            <button
              type="button"
              class="btn bi bi-trash3 px-0 pt-1 text-secondary"
              @click="clearBook(book.id)"
          /></span>
          <span v-if="index + 1 < author.books.length"> , </span>
        </span>
        <button
          type="button"
          class="btn ms-1 col-auto bi bi-plus-lg text-secondary"
          @click="showModalAddBook = true"
        />
      </span>
    </div>
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-outline-primary me-2" @click="onCancel">
        Отменить
      </button>
      <button class="btn btn-primary" type="submit">Сохранить</button>
    </div>
  </form>
  <item-list-modal
    :items="bookList"
    :show="showModalAddBook"
    @hide="showModalAddBook = false"
    @select-item="onSelectBook"
  />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { Author, Book } from "@/models";
import { updateState } from "@/helper";
import ItemListModal from "@/components/ItemListModal.vue";
import { getBook } from "@/api";

const props = defineProps({
  author: { type: Object, required: true },
  books: { type: Array, default: () => [] },
});
const emit = defineEmits(["add-author", "update-author", "to-list"]);

const author = ref(new Author(props.author));
const showModalAddBook = ref(false);

const bookList = computed(() =>
  props.books
    .filter((book) => !author.value.books.find((b) => b.id === book.id))
    .map((book) => ({ id: book.id, title: book.title }))
);
async function onSelectBook(b) {
  const books = author.value.books.slice();
  const book = await getBook(b.id);
  books.push({id: book.id, title: book.title})
  updateState(author, "books", books);
}
function clearBook(id) {
  author.value.books = author.value.books.filter((b) => b.id !== id);
}
function onCancel() {
  author.value = new Author(props.author);
  emit("to-list");
}
function onSubmit(e) {
  emit("update-author", author.value);
}

watch(
  () => props.author,
  (val) => {
    author.value = new Author(val);
  }
);
</script>

<style scoped></style>
