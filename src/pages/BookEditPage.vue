<template>
  <form class="row g-2" @submit.prevent="onSubmit">
    <div v-if="props.view" class="row-cols-auto ps-2">
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="$emit('to-edit')"
      >
        Редактировать
      </button>
    </div>
    <div class="mt-3 row">
      <div class="col-auto">
        <img :src="thumbnail" class="rounded" alt="thumbnail" />
        <template v-if="!props.view">
          <h6 for="thumbnail" class="form-label mt-2">Адрес картинки</h6>
          <input
            type="text"
            class="form-control"
            id="thumbnail"
            :value="book.thumbnail"
            @input="onInput"
          />
        </template>
      </div>
      <div class="col">
        <div :class="classes.row">
          <h6 for="title" class="form-label" :class="classes.h6">Название</h6>
          <div class="col-sm-12">
            <input
              type="text"
              :class="classes.input"
              id="title"
              :value="book.title"
              @input="onInput"
              required
            />
          </div>
        </div>
        <div class="row align-items-center" :class="classes.row">
          <span class="col-auto ">Автор(ы)</span>
          <span id="authors" class="col">
            <span
              v-for="(author, index) in book.authors"
              :key="index"
              class="row-cols-auto align-items-center"
            >
              <span class="">{{ author.fio }}</span>
              <button
                type="button"
                class="btn bi bi-trash3 ps-1"
                v-if="!props.view"
                @click="clearAuthor(author.id)"
              />
              <span class="" v-if="index + 1 < book.authors.length">
                ,
              </span>
            </span>
            <button
              type="button"
              class="btn ms-5 col-auto bi bi-plus-lg"
              v-if="!props.view"
              @click="showModalAddAuthor = true"
             />
          </span>
        </div>
        <div :class="classes.row">
          <h6 for="ISBN" class="col-auto col-form-label">ISBN</h6>
          <div class="col-auto">
            <input
              id="ISBN"
              type="text"
              :class="classes.input"
              :value="book.ISBN"
              @input="onInput"
            />
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="categories" class="col-auto col-form-label">Категории</h6>
          <div class="col-auto">
            <input
              id="categories"
              type="text"
              :class="classes.input"
              :value="categories"
              @input="onInputRange"
            />
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="tags" class="col-auto col-form-label">Ключевые слова</h6>
          <div class="col-auto">
            <input
              id="tags"
              type="text"
              :class="classes.input"
              :value="tags"
              @input="onInputRange"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <h6 for="description" class="form-label">Описание</h6>
      <p v-if="props.view" id="title" class="form-label">
        <em
        >{{ desc }}
          <span
            class="short-desc primary"
            v-if="book.description && book.description.length > 300"
            @click="isShortDesc = !isShortDesc"
          >
            &lt;&lt;{{ collapseText }}&gt;&gt;</span
          >
        </em>
      </p>
      <textarea
        id="description"
        class="form-control"
        v-else
        :value="book.description"
        @input="onInput"
        type="text"
        rows="8"
      ></textarea>
    </div>
    <div class="col-12" v-if="!props.view">
      <button class="btn btn-primary" type="submit">Сохранить</button>
    </div>
  </form>
  <item-list-modal :items="authorsList" :show="showModalAddAuthor" />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { Book } from "@/models";
import { strToArr } from "@/helper";
import { getAuthor } from "@/api";
import ItemListModal from "@/components/ItemListModal.vue";

const defaultLink = "/default-img.png";

const props = defineProps({
  book: {
    type: Object,
    default: () => ({}),
  },
  authors: {
    type: Array,
    default: () => [],
  },
  view: { type: Boolean, default: false },
});

const emit = defineEmits(["add-book", "update-book", "to-edit"]);

const book = ref(new Book(props.book));
fillBooksWithAuthors();

const isShortDesc = ref(false);
const showModalAddAuthor = ref(false);

const desc = computed(() => {
  return !isShortDesc.value &&
  book.value.description &&
  book.value.description.length > 300
    ? book.value.description.slice(0, 300)
    : book.value.description;
});
const collapseText = computed(() =>
  isShortDesc.value ? "свернуть" : "развернуть"
);
const thumbnail = computed(() =>
  book.value.thumbnail ? book.value.thumbnail : defaultLink
);
const classes = computed(() => ({
  input: props.view ? "form-control-plaintext" : "form-control",
  row: `row ${props.view ? "" : "mb-3"}`,
  h6: props.view ? "mb-0" : "",
}));
const tags = computed(() =>
  book.value.tags ? book.value.tags.join(", ") : ""
);
const categories = computed(() =>
  book.value.categories ? book.value.categories.join(", ") : ""
);

const authorsList = computed(() =>
  props.authors.map((author) => ({ id: author.id, title: author.fio }))
);

function updateBook(name, value) {
  const val = {};
  val[name] = value;
  book.value = Object.assign({}, book.value, val);
}

function onInput(e) {
  updateBook(e.target.id, e.target.value);
}

function onInputRange(e) {
  updateBook(e.target.id, strToArr(e.target.value));
}

function onSubmit(e) {
  book.value.authors = book.value.authors.map((author) => author.id);
  if (book.value.id) {
    emit("update-book", book.value);
    return;
  }
  emit("add-book", book.value);
}

function clearAuthor(id) {
  updateBook(
    "authors",
    book.value.authors.filter((a) => a.id !== id)
  );
}

async function fillBooksWithAuthors() {
  const authors = [];
  for (let author of book.value.authors) {
    const fullAuthor = await getAuthor(author.id);
    authors.push(fullAuthor);
  }
  updateBook("authors", authors);
}

watch(
  () => props.book,
  (val) => {
    book.value = new Book(val);
    fillBooksWithAuthors();
  }
);
</script>

<style lang="scss" scoped>
.short-desc {
  cursor: pointer;
  color: #15c;
  font-weight: 500;
}

.btn-close {
  width: 0.3rem;
  height: 0.3rem;
}
</style>