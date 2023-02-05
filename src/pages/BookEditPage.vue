<template>
  <form class="row" @submit.prevent="onSubmit">
    <div v-if="props.view && props.book.id" class="ps-2 mb-2">
      <button
        type="button"
        class="btn btn-outline-primary bi bi-pencil"
        @click="$emit('to-edit')"
      />
      <button
        type="button"
        class="btn btn-outline-danger bi bi-trash3 ms-2"
        @click="$emit('remove-book', props.book.id)"
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
          <h6 class="col-auto" :class="props.view ? 'mb-0' : 'mb-1'">
            Автор(ы)
          </h6>
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
                  v-if="!props.view"
                  @click="clearAuthor(author.id)"
              /></span>
              <span class="" v-if="index + 1 < book.authors.length"> , </span>
            </span>
            <button
              type="button"
              class="btn ms-1 col-auto bi bi-plus-lg text-secondary"
              v-if="!props.view"
              @click="showModalAddAuthor = true"
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
        <div class="row">
          <h6 for="price" class="col-auto col-form-label">Цена</h6>
          <div v-if="props.view" class="col-auto">
            <input
              type="text"
              class="form-control-plaintext"
              :value="book.price.amount + ' ' + book.price.currencyCode"
              @input="onInputAmount"
            />
          </div>
          <div v-if="!props.view" class="col-auto">
            <input
              type="text"
              class="form-control"
              :value="book.price.amount"
              @input="onInputAmount"
            />
          </div>
          <div v-if="!props.view" class="col-auto">
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
        <template v-if="!props.view">
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
        v-model="book.description"
        type="text"
        rows="8"
      ></textarea>
    </div>
    <div class="d-flex justify-content-end mt-3" v-if="!props.view">
      <button class="btn btn-outline-primary me-2" @click="onCancel">
        Отменить
      </button>
      <button class="btn btn-primary" type="submit">Сохранить</button>
    </div>
  </form>
  <item-list-modal
    :items="authorsList"
    :show="showModalAddAuthor"
    @hide="showModalAddAuthor = false"
    @select-item="onSelectAuthor"
  />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { Book } from "@/models";
import { strToArr, updateState } from "@/helper";
import { getAuthor } from "@/api";
import ItemListModal from "@/components/ItemListModal.vue";

const defaultLink = "/default-img.png";

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
  authors: {
    type: Array,
    default: () => [],
  },
  view: { type: Boolean, default: false },
});

const emit = defineEmits(["update-book", "remove-book", "to-edit", "to-view"]);

const book = ref(new Book(props.book));

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
  props.authors
    .filter((author) => !book.value.authors.find((a) => a.id === author.id))
    .map((author) => ({ id: author.id, title: author.fio }))
);

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

function onSubmit(e) {
  // book.value.authors = book.value.authors.map((author) => ({ id: author.id }));
  emit("update-book", book.value);
}

function onCancel() {
  book.value = new Book(props.book);
  emit("to-view");
}

function clearAuthor(id) {
  book.value.authors = book.value.authors.filter((a) => a.id !== id);
}

async function onSelectAuthor(a) {
  const authors = book.value.authors.slice();
  const author = await getAuthor(a.id);
  authors.push({ id: author.id, fio: author.fio });
  updateState(book,"authors", authors);
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