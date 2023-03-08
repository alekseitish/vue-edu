<template>
  <spinner v-if="isLoading" />
  <form v-else class="row" @submit.prevent="onSubmit">
    <div v-if="view && book.id" class="ps-2 mb-2">
      <button
        type="button"
        class="btn btn-outline-primary bi bi-pencil"
        @click="toEdit"
      />
      <button
        type="button"
        class="btn btn-outline-danger bi bi-trash3 ms-2"
        @click="onRemove"
      />
    </div>
    <div class="row mb-3">
      <div class="col-8">
        <div :class="classes.row">
          <h6 for="title" class="form-label" :class="classes.h6">Название</h6>
          <div class="col-sm-12">
            <input
              type="text"
              :class="classes.input"
              id="title"
              v-model="book.title"
              required
            />
          </div>
        </div>
        <div class="d-flex align-items-center" :class="classes.row">
          <h6 class="col-auto" :class="view ? 'mb-0' : 'mb-1'">Автор(ы)</h6>
          <span class="col">
            <span
              v-for="(author, index) in book.authors"
              :key="index"
              class="row-cols-auto"
            >
              <span class="author"
                >{{ author.fio }}
                <button
                  type="button"
                  class="btn bi bi-trash3 px-0 pt-1 text-secondary"
                  v-if="!view"
                  @click="clearAuthor(author.id)"
              /></span>
              <span class="" v-if="index + 1 < book.authors.length"> , </span>
            </span>
            <button
              type="button"
              class="btn ms-1 col-auto bi bi-plus-lg text-secondary"
              v-if="!view"
              @click="onAddAuthor"
            />
          </span>
        </div>
        <div :class="classes.row">
          <h6 for="publishedDate" class="col-auto col-form-label">
            Дата публикации
          </h6>
          <div class="col">
            <input
              id="publishedDate"
              type="text"
              :class="classes.input"
              v-model="book.publishedDate"
            />
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="ISBN" class="col-auto col-form-label">ISBN</h6>
          <div class="col">
            <input
              id="ISBN"
              type="text"
              :class="classes.input"
              v-model="book.ISBN"
            />
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="categories" class="col-auto col-form-label">Категории</h6>
          <div class="col">
            <input
              id="categories"
              type="text"
              :class="classes.input"
              :value="categories"
              @change="onInputRange"
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
        <div class="row">
          <h6 for="price" class="col-auto col-form-label">Цена</h6>
          <div v-if="view" class="col-auto">
            <input
              type="text"
              class="form-control-plaintext"
              :value="price"
              @input="onInputAmount"
            />
          </div>
          <div v-if="!view" class="col-auto">
            <input
              type="text"
              class="form-control"
              :value="book.price.amount"
              @input="onInputAmount"
            />
          </div>
          <div v-if="!view" class="col-auto">
            <select
              class="form-select"
              :value="book.price.currencyCode"
              @change="onInputCurrencyCode"
            >
              <option value="RUB" selected>RUB</option>
              <option value="EUR">EUR</option>
              <option value="DOL">DOL</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-4">
        <img :src="thumbnail" class="rounded" alt="thumbnail" />
        <template v-if="!view">
          <h6 for="thumbnail" class="form-label mt-2">Адрес картинки</h6>
          <input
            type="text"
            class="form-control"
            id="thumbnail"
            v-model="book.thumbnail"
          />
        </template>
      </div>
    </div>
    <div>
      <h6 for="description" class="form-label">Описание</h6>
      <p v-if="view" id="title" class="form-label">
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
        v-model="book.description"
        type="text"
        rows="8"
      ></textarea>
    </div>
    <div class="d-flex justify-content-end mt-3" v-if="!view">
      <button class="btn btn-outline-primary me-2" @click="onCancel">
        Отменить
      </button>
      <button class="btn btn-primary" type="submit">Сохранить</button>
    </div>
  </form>
  <item-list-modal
    :items="authorsListFiltrated"
    :show="showModalAddAuthor"
    @hide="showModalAddAuthor = false"
    @select-item="onSelectAuthor"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Book } from "@/models";
import { strToArr } from "@/helper";
import {
  addBook,
  getAuthor,
  getAuthors,
  getBook,
  removeBook,
  updateBook,
} from "@/api";
import ItemListModal from "@/components/ItemListModal.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import Spinner from "@/components/spinner.vue";

const defaultLink = "/default-img.png";

const props = defineProps({
  id: { type: String, default: null },
});

onMounted(() => {
  if (!props.id) {
    isLoading.value = false;
    return;
  }
  view.value = route.query.hasOwnProperty("view");
  getBook(props.id).then((data) => {
    book.value = data;
    bookCache = Object.assign({}, data);
    isLoading.value = false;
  });
});
onBeforeRouteUpdate((to, from) => {
  view.value = to.query.hasOwnProperty("view");
  if (!to.params.id && to.fullPath !== from.fullPath) {
    bookCache = new Book({});
    book.value = Object.assign({}, bookCache);
  }
});

const router = useRouter();
const route = useRoute();

const book = ref(new Book({}));
let bookCache = new Book({});

const authorList = ref([]);

const view = ref(false);

const isShortDesc = ref(false);
const showModalAddAuthor = ref(false);
const isLoading = ref(true);

const price = computed(() => {
  const amount = book.value?.price?.amount || "";
  const currencyCode = book.value?.price?.currencyCode || "";
  return amount + (!!amount && !!currencyCode ? " " + currencyCode : "");
});
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
  input: view.value ? "form-control-plaintext" : "form-control",
  row: `row ${view.value ? "" : "mb-3"}`,
  h6: view.value ? "mb-0" : "",
}));
const tags = computed(() =>
  book.value.tags ? book.value.tags.join(", ") : ""
);
const categories = computed(() =>
  book.value.categories ? book.value.categories.join(", ") : ""
);

const authorsListFiltrated = computed(() =>
  authorList.value
    .filter((author) => !book.value.authors.find((a) => a.id === author.id))
    .map((author) => ({ id: author.id, title: author.fio }))
);

function toEdit() {
  router.replace({ query: {} });
}

function onInputRange(e) {
  book.value[e.target.id] = strToArr(e.target.value);
}

function onInputAmount(e) {
  const amount = parseFloat(e.target.value);
  if (isNaN(amount)) {
    return;
  }
  book.value.price = { amount, currencyCode: book.value.price.currencyCode };
}

function onInputCurrencyCode(e) {
  book.value.price = {
    amount: book.value.price.amount,
    currencyCode: e.target.value,
  };
}

async function onSubmit() {
  // book.value.authors = book.value.authors.map((author) => ({ id: author.id }));
  if (book.value.id) {
    bookCache = await updateBook(book.value);
  } else {
    bookCache = await addBook(book.value);
  }
  book.value = Object.assign({}, bookCache);
  router.replace({ query: { view: null }, params: { id: book.value.id } });
}

function onCancel() {
  if (!book.value.id) {
    router.push({ name: "bookList" });
    return;
  }
  book.value = Object.assign({}, bookCache);
  router.replace({ query: { view: null }, params: { id: book.value.id } });
}

async function onRemove() {
  if (book.value.id) {
    await removeBook(book.value.id);
    router.push({ name: "bookList" });
  }
}

function clearAuthor(id) {
  book.value.authors = book.value.authors.filter((a) => a.id !== id);
}
async function onAddAuthor() {
  authorList.value = await getAuthors();
  showModalAddAuthor.value = true;
}
async function onSelectAuthor(a) {
  const authors = book.value.authors.slice();
  const author = await getAuthor(a.id);
  authors.push({ id: author.id, fio: author.fio });
  book.value.authors = authors;
  // updateState(book, "authors", authors);
}

watch(
  () => props.book,
  (val) => {
    book.value = new Book(val);
  }
);
</script>

<style lang="scss" scoped>
.short-desc {
  cursor: pointer;
  color: #15c;
  font-weight: 500;
}

.author {
  white-space: nowrap;
}
</style>
